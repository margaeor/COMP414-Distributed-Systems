import { put, call, take } from "redux-saga/effects";
import { changeScreen, EXIT_GAME, startLoading, setPlay } from "../actions";
import { LoaderStep, Play, ScreenState } from "../types";
import { sleep, callApi, failLoadingAndExit } from "./utils";
import { generateFens } from "./api/fake/fake";
import {
  retrievePlay,
  checkPlay,
  setupSocket,
  setupSocketChannel,
} from "./api/game";
import { RECEIVE_DATA, READY } from "./api/game/contract";

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

export default function* game(token: string, id: string) {
  const res = yield* connectToServer(token, id);
  if (!res) return;
  const { socket, channel } = res;
}
