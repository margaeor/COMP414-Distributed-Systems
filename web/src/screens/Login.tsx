import React, { useState } from "react";
import { connect } from "react-redux";
import { loginForgot, loginSignUp, loginSubmit } from "../store/actions";
import { selectError } from "../store/selectors";
import { State } from "../store/types";

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
    if (username === "" || password === "") return;
    switch (type) {
      case LoginType.LOGIN:
        loginSubmit(username, password);
        break;
      case LoginType.FORGOT:
        if (answer === "") break;
        loginForgot(username, password, answer);
        break;
      case LoginType.SIGN_UP:
        if (email === "" || answer === "") break;
        loginSignUp(username, password, email, answer);
        break;
    }
  };

  return (
    <form
      className="login form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
        return false;
      }}
    >
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
          <input
            type="button"
            className="form__button"
            onClick={() => setType(LoginType.FORGOT)}
            value="Forgot Password"
          />
          <input
            type="button"
            className="form__button"
            onClick={() => setType(LoginType.SIGN_UP)}
            value="Sign Up"
          />
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
          <label className="form__label" htmlFor="answer">
            Who was your first (hot) Teacher?
          </label>
          <input
            id="answer"
            className="form__input"
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <input
            type="button"
            className="form__button"
            onClick={() => setType(LoginType.LOGIN)}
            value="Go Back"
          />
        </>
      )}

      {error !== "" && <span className="form__error">{error}</span>}
      <input className="form__submit" value="Submit" type="submit" />
    </form>
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
