import { createStore, applyMiddleware, Middleware } from "redux";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";
import rootReducer from "./reducers";

const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];
const store = createStore(rootReducer, applyMiddleware(...middleware));

// Start root saga
sagaMiddleware.run(rootSaga, store.dispatch);

export default store;
