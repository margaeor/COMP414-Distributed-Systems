import {
  UpdateLoginStepAction,
  UpdateLoginDataAction,
  UPDATE_LOGIN_DATA,
  UPDATE_LOGIN_STEP,
} from "../actions/login";
import { NULL_LOGIN_STATE, LoginState } from "../types";

export default function game(
  state = NULL_LOGIN_STATE,
  action: UpdateLoginDataAction | UpdateLoginStepAction
): LoginState {
  switch (action.type) {
    case UPDATE_LOGIN_DATA:
      return {
        ...state,
        username: action.username,
        password: action.password,
        answer: action.answer,
      };
    case UPDATE_LOGIN_STEP:
      return {
        ...state,
        step: action.step,
        error: action.error,
      };
    default:
      return state;
  }
}
