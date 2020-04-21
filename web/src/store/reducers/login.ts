import {
  UpdateLoginStepAction,
  UpdateLoginDataAction,
  UPDATE_LOGIN_DATA,
  UPDATE_LOGIN_STEP,
  UpdateLoginUsernameAction,
  UpdateLoginPasswordAction,
  UpdateLoginAnswerAction,
  UPDATE_LOGIN_USERNAME,
  UPDATE_LOGIN_PASSWORD,
  UPDATE_LOGIN_ANSWER,
} from "../actions/login";
import { NULL_LOGIN_STATE, LoginState } from "../types";

export default function game(
  state = NULL_LOGIN_STATE,
  action:
    | UpdateLoginDataAction
    | UpdateLoginStepAction
    | UpdateLoginUsernameAction
    | UpdateLoginPasswordAction
    | UpdateLoginAnswerAction
): LoginState {
  switch (action.type) {
    case UPDATE_LOGIN_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case UPDATE_LOGIN_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    case UPDATE_LOGIN_ANSWER:
      return {
        ...state,
        answer: action.answer,
      };
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
