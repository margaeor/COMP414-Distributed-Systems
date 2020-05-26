import { call, put, take } from "redux-saga/effects";
import {
  ChangePrivilegesAction,
  changeScreen,
  CHANGE_PRIVILEGES,
  CreateTournamentAction,
  CREATE_TOURNAMENT,
  CANCEL_LOADING,
  stopLoading,
} from "../actions";
import { ScreenState } from "../types";
import { changePrivileges, createTournament } from "./api/administration";
import { callApi, failLoadingAndExit } from "./utils";
import { WrongParametersError } from "./api/errors";

export default function* administration(token: string) {
  yield put(changeScreen(ScreenState.ADMINISTRATION));

  while (1) {
    const act: CreateTournamentAction | ChangePrivilegesAction = yield take([
      CREATE_TOURNAMENT,
      CHANGE_PRIVILEGES,
    ]);

    try {
      switch (act.type) {
        case CREATE_TOURNAMENT:
          yield* callApi(
            "Creating Tournament...",
            call(createTournament, token, act.name, act.maxPlayers, act.game)
          );
          break;
        case CHANGE_PRIVILEGES:
          yield* callApi(
            "Changing Privileges...",
            call(changePrivileges, token, act.user, act.admin, act.officer)
          );
          break;
      }
    } catch (e) {
      if (e instanceof WrongParametersError) {
        yield* failLoadingAndExit(e.message, "Could not submit form");
        yield put(stopLoading());
      } else {
        throw e;
      }
    }
  }
}
