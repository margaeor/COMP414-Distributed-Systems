import React from "react";
import "./Login.css";
import { connect } from "react-redux";
import { State, LoginState, LoginStep } from "../../store/types";
import { selectLoginData } from "../../store/selectors";
import {
  updateLoginUsername,
  updateLoginPassword,
  updateLoginAnswer,
  submitLogin,
  forgotPassword,
  goToSignUp,
  returnToLogin,
} from "../../store/actions";

interface IDispatchProps {
  updateLoginUsername: (a: string) => void;
  updateLoginPassword: (a: string) => void;
  updateLoginAnswer: (a: string) => void;
  submitLogin: () => void;
  submitForgot: () => void;
  forgotPassword: () => void;
  goToSignUp: () => void;
  returnToLogin: () => void;
}

interface IProps extends IDispatchProps, LoginState {}

const Login = (props: IProps) => {
  const s = props.step;
  return (
    <div className="login">
      <span className="header">
        {s == LoginStep.FORM && "Sign In"}
        {s == LoginStep.FORGOT && "Forgot Password"}
        {s == LoginStep.SIGN_UP && "Sign Up"}
      </span>

      <input
        type="text"
        placeholder="Username"
        value={props.username}
        onChange={(e) => props.updateLoginUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder={s == LoginStep.FORM ? "Password" : "New Password"}
        value={props.password}
        onChange={(e) => props.updateLoginPassword(e.target.value)}
      />

      {s == LoginStep.FORM ? (
        <div className="actionButtons">
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              props.forgotPassword();
            }}
          >
            Forgot Password
          </a>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              props.goToSignUp();
            }}
          >
            Sign Up
          </a>
        </div>
      ) : (
        <>
          <span>Who was your first (hot) School Teacher?</span>
          <input
            type="text"
            placeholder="Answer"
            value={props.answer}
            onChange={(e) => props.updateLoginAnswer(e.target.value)}
          />
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              props.returnToLogin();
            }}
          >
            Go back
          </a>
        </>
      )}

      {props.error !== "" && <span className="error">{props.error}</span>}
      <input
        className="loginButton"
        type="submit"
        value="Submit"
        onClick={(e) => props.submitLogin()}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const d = selectLoginData(state);
  return {
    step: d.step,
    username: d.username,
    password: d.password,
    answer: d.answer,
    error: d.error,
  };
};

const mapDispatchToProps = {
  updateLoginUsername,
  updateLoginPassword,
  updateLoginAnswer,
  submitLogin,
  forgotPassword,
  goToSignUp,
  returnToLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
