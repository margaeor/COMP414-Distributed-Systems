import React, { useState } from "react";
import "./Login.scss";
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
  const [email, setEmail] = useState("");

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
    <div className="login form">
      <span className="form__header">
        {type == LoginType.LOGIN && "Sign In"}
        {type == LoginType.FORGOT && "Forgot Password"}
        {type == LoginType.SIGN_UP && "Sign Up"}
      </span>

      <input
        className="form__input form__input--first"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="form__input"
        type="password"
        placeholder={type == LoginType.LOGIN ? "Password" : "New Password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {type == LoginType.LOGIN ? (
        <div className="form__dual-buttons">
          <button onClick={() => setType(LoginType.FORGOT)}>
            Forgot Password
          </button>
          <button onClick={() => setType(LoginType.SIGN_UP)}>Sign Up</button>
        </div>
      ) : (
        <>
          {type == LoginType.SIGN_UP && (
            <input
              className="form__input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <label className="form__label">
            Who was your first (hot) Teacher?
          </label>
          <input
            className="form__input"
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            className="form__button"
            onClick={() => setType(LoginType.LOGIN)}
          >
            Go Back
          </button>
        </>
      )}

      {error !== "" && <span className="error">{error}</span>}
      <button className="form__submit" onClick={submit}>
        Submit
      </button>
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
