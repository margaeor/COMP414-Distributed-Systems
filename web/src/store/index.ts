import { createStore, applyMiddleware, Middleware } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const middleware: Middleware[] = [thunk];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
