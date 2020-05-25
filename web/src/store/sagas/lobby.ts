import { call, cancel, fork, put, select, take } from "redux-saga/effects";
import {
  changeScreen,
  JOIN_GAME,
  JOIN_QUICK_PLAY,
  JOIN_TOURNAMENT,
  updateOngoingPlays,
  updateTournaments,
  updateScores,
  startLoading,
  loadingFailed,
  CANCEL_LOADING,
  stopLoading,
} from "../actions";
import { selectUser } from "../selectors";
import {
  Game,
  Play,
  ScreenState,
  Tournament,
  TournamentPlay,
  User,
  FinishedPracticePlay,
  FinishedTournament,
} from "../types";
import {
  checkQuickPlay,
  fetchLobbyData,
  joinQuickGame,
  joinTournament,
  fetchScores,
} from "./api/lobby";
import { callApi, sleep } from "./utils";
import { RefreshTokenError } from "./api/errors";

function* fetchLobby(token: string, username: string) {
  const data: {
    tournaments: Tournament[];
    ongoingPlays: (Play | TournamentPlay)[];
  } = yield call(fetchLobbyData, token, username);
  yield put(updateOngoingPlays(data.ongoingPlays));
  yield put(updateTournaments(data.tournaments));
}

function* periodicFetch(token: string) {
  const { username }: User = yield select(selectUser);
  try {
    const scores: (FinishedTournament | FinishedPracticePlay)[] = yield call(
      fetchScores,
      token,
      username
    );
    yield put(updateScores(scores));
  } catch (e) {
    console.log("fetching failed: " + e.toString());
  }

  while (1) {
    try {
      yield* fetchLobby(token, username);
    } catch (e) {
      console.log("fetching failed: " + e.toString());
    }
    yield* sleep(5000);
  }
}

function* quickPlay(token: string, game: Game) {
  try {
    yield* callApi("Joining Queue...", call(joinQuickGame, token, game));
  } catch (e) {
    const inQueue = yield call(checkQuickPlay, token, game);
    if (!inQueue) {
      yield put(
        loadingFailed(e.message, "Error while joining queue", false, true)
      );
      yield take(CANCEL_LOADING);
      return null;
    }
  }

  // Wait until we join a play
  yield put(startLoading("Waiting to join game..."));
  let timedOut = true;
  for (let i = 0; i < 10; i++) {
    try {
      const inQueue = yield call(checkQuickPlay, token, game);
      if (!inQueue) {
        timedOut = false;
        break;
      }
    } catch (e) {
      console.log("misc error: " + e.message);
      if (e instanceof RefreshTokenError) throw e;
    }
    yield* sleep(5000);
  }
  if (timedOut) return null;
  yield put(stopLoading());

  // Get play
  const data: {
    tournaments: Tournament[];
    ongoingPlays: (Play | TournamentPlay)[];
  } = yield call(fetchLobbyData, token, "irrelevant");
  return data.ongoingPlays ? data.ongoingPlays[0].id : null;
}

export default function* lobby(token: string) {
  yield put(changeScreen(ScreenState.LOBBY));
  const fetchHandler = yield fork(periodicFetch, token);

  while (1) {
    const act = yield take([JOIN_GAME, JOIN_TOURNAMENT, JOIN_QUICK_PLAY]);
    let id;

    switch (act.type) {
      case JOIN_GAME:
        // Exit to join game
        yield cancel(fetchHandler);
        return { screen: ScreenState.GAME, id: act.id };
      case JOIN_TOURNAMENT:
        yield call(joinTournament, token, act.id);
        break;
      case JOIN_QUICK_PLAY:
        yield cancel(fetchHandler);
        id = yield* quickPlay(token, act.game);
        if (id) {
          return { screen: ScreenState.GAME, id };
        } else {
          return { screen: ScreenState.LOBBY };
        }
    }
  }
  return { screen: ScreenState.LOBBY };
}
