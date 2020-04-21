import { Dispatch } from "redux";
import joinFakeGame from "./fake";
import getAccessToken from "./login";
import lobby from "./lobby";

export default function* rootSaga(dispatch: Dispatch) {
  yield* joinFakeGame();

  const token = yield* getAccessToken();
  const game = yield* lobby(token);
}
