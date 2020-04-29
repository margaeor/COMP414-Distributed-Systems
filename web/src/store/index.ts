import { createStore, applyMiddleware, Middleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";
import rootReducer from "./reducers";

const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];

// Add redux dev tool
let composeEnhancers = compose;
if (process.env.NODE_ENV !== "production") {
  /* eslint-disable no-underscore-dangle, @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable */
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// Start root saga
sagaMiddleware.run(rootSaga, store.dispatch);

export default store;
