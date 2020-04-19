import { createStore, applyMiddleware, Middleware } from "redux";

import rootReducer from "./reducers";

const middleware: Middleware[] = [];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
