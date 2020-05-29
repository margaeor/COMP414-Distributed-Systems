import { EventChannel } from "redux-saga";
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
import { selectGameData, selectUser } from "../selectors";
import { PlayStep, ScreenState, User } from "../types";
import {
  checkPlay,
  emitExit,
  emitMessage,
  emitMove,
  setupSocket,
  setupSocketChannel,
  emitReady,
} from "./api/game";
import {
  RECEIVE_DATA,
  RECEIVE_MESSAGE,
  RECEIVE_READY,
  RECEIVE_UPDATED_STATE,
  DISCONNECTED,
} from "./api/game/receiverContract";
import { joinPlay } from "./api/lobby";
import { callApi, failLoadingAndExit, sleep } from "./utils";
import { UserCancelledError } from "./api/errors";

function* connectToServer(token: string, id: string) {
  let socket: SocketIOClient.Socket | null = null;
  let channel = null;
  try {
    // Retrieve Play and ip
    const { username }: User = yield select(selectUser);
    const {
      play,
      server: { url: serverName },
    } = yield* callApi(
      "Loading Play...",
      call(joinPlay, token, id, username),
      true
    );

    const url = `/games/${serverName}`;
    console.log(url);
    // Save and continue
    yield put(setPlay(play));
    yield put(changeScreen(ScreenState.GAME));

    // Connect to game server and verify validity
    const valid = yield* callApi(
      "Connecting to Game Server...",
      call(checkPlay, token, url, id),
      true
    );

    // If not valid exit
    if (!valid) {
      yield* failLoadingAndExit("Tried to join an Invalid Play.");
      return null;
    }

    socket = yield* callApi(
      "Creating Route...",
      call(setupSocket, token, url, id),
      true
    );
    if (!socket) {
      yield* failLoadingAndExit("Could not create socket...");
      return null;
    }
    channel = (yield call(setupSocketChannel, socket)) as EventChannel<any>;

    yield put(startLoading("Waiting for Opponent..."));
    let act;

    do {
      act = yield take(channel);
      console.log(act);
    } while (act.type !== RECEIVE_READY && act.type !== DISCONNECTED);

    if (act.type === RECEIVE_READY) {
      // emitMessage(socket, `${username} connected`);
      return { socket, channel };
    } else {
      yield* failLoadingAndExit("Connection Closed");
      return null;
    }
  } catch (e) {
    if (channel) channel.close();
    if (socket) socket.disconnect();
    if (!(e instanceof UserCancelledError))
      yield* failLoadingAndExit("Connection failed: " + e.message);
    return null;
  }
}

function* handleServer(channel: any) {
  // Messages
  yield put(updateHistory(""));
  let history = "";
  let isOver = false;
  let firstData = true;

  while (1) {
    const act = yield take(channel);

    if (firstData && act.type === RECEIVE_DATA) {
      yield put(stopLoading());
      firstData = false;
    }

    switch (act.type) {
      case RECEIVE_MESSAGE:
        console.log(act);
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
        if (act.event.event === "OP_DISCONNECTED" && !isOver)
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
      case DISCONNECTED:
        return DISCONNECTED;
    }
  }
}

function* handlePlayer(socket: SocketIOClient.Socket) {
  let isOver = false;
  let data;
  const { username: user }: User = yield select(selectUser);

  while (!isOver) {
    const act = yield take([
      MAKE_MOVE,
      EXIT_GAME,
      CANCEL_LOADING,
      SEND_MESSAGE,
    ]);

    switch (act.type) {
      case MAKE_MOVE:
        data = yield select(selectGameData);
        emitMove(socket, data, act.move);
        break;
      case SEND_MESSAGE:
        emitMessage(socket, `${user}: ${act.message}`);
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

function* game(token: string, id: string) {
  const res = yield* connectToServer(token, id);
  if (!res) return false;
  const { socket, channel } = res;

  try {
    const res = yield race({
      player: call(handlePlayer, socket),
      server: call(handleServer, channel),
    });

    if (res.server && res.server === DISCONNECTED) {
      yield put(startLoading("Lost Connection, waiting to reconnect..."));
      if (socket) socket.close();
      if (channel) channel.close();
      yield* sleep(5000);
      return true;
    }
  } finally {
    if (socket) socket.close();
    if (channel) channel.close();
  }
}

export default function* gameLoop(token: string, id: string) {
  while (yield* game(token, id));
}
