import { call, put, take } from "redux-saga/effects";
import {
  ChangePrivilegesAction,
  changeScreen,
  CHANGE_PRIVILEGES,
  CreateTournamentAction,
  CREATE_TOURNAMENT,
} from "../actions";
import { ScreenState } from "../types";
import { changePrivileges, createTournament } from "./api/administration";
import { callApi } from "./utils";

export default function* administration(token: string) {
  yield put(changeScreen(ScreenState.ADMINISTRATION));

  while (1) {
    const act: CreateTournamentAction | ChangePrivilegesAction = yield take([
      CREATE_TOURNAMENT,
      CHANGE_PRIVILEGES,
    ]);

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
  }
}
