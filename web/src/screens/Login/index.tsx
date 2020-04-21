import React from "react";
import "./style.css";

const Login: React.FunctionComponent = () => {
  return (
    <form action="">
      <input type="text" id="username" placeholder="Username" />
      <input type="password" id="password" placeholder="Password" />
      <input className="loginButton" type="submit" value="Submit" />
    </form>
  );
};

export default Login;
