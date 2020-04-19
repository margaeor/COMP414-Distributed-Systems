import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import "./style.css";

import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
