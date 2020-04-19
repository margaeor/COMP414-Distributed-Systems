import React from "react";
import { render } from "react-dom";
import "./style.css";

const App = props => {
  return (
    <div>
      <h1>Hello World!</h1>
      <picture>
        <img src={require("./img/meme.jpg")} alt={`Very good meme`} />
      </picture>
    </div>
  );
};

render(<App apple="green" />, document.getElementById("root"));
