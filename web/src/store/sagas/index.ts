import { Dispatch } from "redux";
import joinFakeGame from "./fake";
import getAccessToken from "./login";

export default function* rootSaga(dispatch: Dispatch) {
  yield* joinFakeGame();

  const token = yield* getAccessToken();
  alert(token);
}
