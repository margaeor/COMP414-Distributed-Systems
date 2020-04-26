import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Routes from "./screens/Routes";
import store from "./store";
import "./styles/style.scss";

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
