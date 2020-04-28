import { call, put, race, select, take } from "redux-saga/effects";
import {
  CANCEL_LOADING,
  changeScreen,
  EXIT_GAME,
  loadingFailed,
  MAKE_MOVE,
  SEND_MESSAGE,
  setPlay,
  startLoading,
  stopLoading,
  updateHistory,
  updatePlayData,
} from "../actions";
import { selectGameData } from "../selectors";
import { PlayStep, ScreenState } from "../types";
import {
  checkPlay,
  emitExit,
  emitMessage,
  emitMove,
  retrievePlay,
  setupSocket,
  setupSocketChannel,
} from "./api/game";
import {
  READY,
  RECEIVE_DATA,
  RECEIVE_MESSAGE,
  RECEIVE_UPDATED_STATE,
} from "./api/game/receiverContract";
import { callApi, failLoadingAndExit } from "./utils";

function* connectToServer(token: string, id: string) {
  yield put(changeScreen(ScreenState.GAME));

  try {
    // Retrieve Play and ip
    const { play, url } = yield* callApi(
      "Loading Play...",
      call(retrievePlay, token, id),
      true
    );
    // Connect to game server and verify validity
    const valid = yield* callApi(
      "Connecting to Game Server...",
      call(checkPlay, token, url, id),
      true
    );

    // If not valid exit
    if (!valid) {
      failLoadingAndExit("Tried to join an Invalid Play.");
      return null;
    }

    // Save and continue
    yield put(setPlay(play));

    const socket: SocketIOClient.Socket = yield* callApi(
      "Creating Route...",
      call(setupSocket, token, url, id),
      true
    );
    const channel = setupSocketChannel(socket);

    yield put(startLoading("Waiting for Opponent..."));
    const act = yield take(channel);
    if (act.type === RECEIVE_DATA && act.event.data === READY)
      return { socket, channel };

    failLoadingAndExit("Connection Closed");
    return null;
  } catch (e) {
    failLoadingAndExit("Connection failed: " + e.message);
    return null;
  }
}

function* handleServer(channel: any) {
  // Messages
  yield put(updateHistory(""));
  let history = "";
  let isOver = false;

  while (!isOver) {
    const act = yield take(channel);

    switch (act.type) {
      case RECEIVE_MESSAGE:
        history = history + "\n" + act.event.message;
        yield put(updateHistory(history));
        break;
      case RECEIVE_DATA:
        yield put(
          updatePlayData(
            act.event.isOver ? PlayStep.FINISHED : PlayStep.ONGOING,
            act.event.data
          )
        );
        isOver = act.event.isOver;
        break;
      case RECEIVE_UPDATED_STATE:
        if (act.event.event === "OP_DISCONNECTED")
          yield put(
            loadingFailed(
              "You can wait for him to reconnect or exit",
              "Opponent disconnected",
              false,
              true
            )
          );
        else if (act.event.event === "OP_RECONNECTED") {
          yield put(stopLoading());
        }
        break;
    }
  }
}

function* handlePlayer(socket: SocketIOClient.Socket) {
  let isOver = false;
  let data;

  while (!isOver) {
    const act = yield take([
      MAKE_MOVE,
      EXIT_GAME,
      CANCEL_LOADING,
      SEND_MESSAGE,
    ]);

    switch (act.type) {
      case MAKE_MOVE:
        ({ data } = yield select(selectGameData));
        emitMove(socket, data, act.move);
        break;
      case SEND_MESSAGE:
        emitMessage(socket, act.message);
        break;
      case EXIT_GAME:
        emitExit(socket);
        return;
      case CANCEL_LOADING:
        emitExit(socket);
        return;
    }
  }
}

export default function* game(token: string, id: string) {
  const res = yield* connectToServer(token, id);
  if (!res) return;
  const { socket, channel } = res;

  yield race({
    handleServer,
    handlePlayer,
  });

  channel.close();
  socket.close();
}
