import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Routes from "./screens/Routes";

import "./styles/style.scss";

import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
