import React, { useState } from "react";
import "./Login.css";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { loginSubmit, loginForgot, loginSignUp } from "../../store/actions";
import { selectError } from "../../store/selectors";

interface IProps {
  loginSubmit: typeof loginSubmit;
  loginForgot: typeof loginForgot;
  loginSignUp: typeof loginSignUp;
  error: string;
}

enum LoginType {
  LOGIN = 0,
  FORGOT = 1,
  SIGN_UP = 2,
}

const Login = ({ loginSignUp, loginSubmit, loginForgot, error }: IProps) => {
  const [type, setType] = useState(LoginType.LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const submit = () => {
    switch (type) {
      case LoginType.LOGIN:
        loginSubmit(username, password);
        break;
      case LoginType.FORGOT:
        loginForgot(username, password, answer);
        break;
      case LoginType.SIGN_UP:
        loginSignUp(username, password, answer);
        break;
    }
  };

  return (
    <div className="login">
      <span className="header">
        {type == LoginType.LOGIN && "Sign In"}
        {type == LoginType.FORGOT && "Forgot Password"}
        {type == LoginType.SIGN_UP && "Sign Up"}
      </span>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder={type == LoginType.LOGIN ? "Password" : "New Password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {type == LoginType.LOGIN ? (
        <div className="actionButtons">
          <button onClick={() => setType(LoginType.FORGOT)}>
            Forgot Password
          </button>
          <button onClick={() => setType(LoginType.SIGN_UP)}>Sign Up</button>
        </div>
      ) : (
        <>
          <span>Who was your first (hot) School Teacher?</span>
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={() => setType(LoginType.LOGIN)}>Go Back</button>
        </>
      )}

      {error !== "" && <span className="error">{error}</span>}
      <button onClick={submit}>Submit</button>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    error: selectError(state),
  };
};

const mapDispatchToProps = {
  loginSubmit,
  loginForgot,
  loginSignUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
