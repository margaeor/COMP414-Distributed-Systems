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
  submitForgot,
  forgotPassword,
  rememberedPassword,
} from "../../store/actions";

interface IDispatchProps {
  updateLoginUsername: (a: string) => void;
  updateLoginPassword: (a: string) => void;
  updateLoginAnswer: (a: string) => void;
  submitLogin: () => void;
  submitForgot: () => void;
  forgotPassword: () => void;
  rememberedPassword: () => void;
}

interface IProps extends IDispatchProps, LoginState {}

const Login = (props: IProps) => {
  if (props.step != LoginStep.FORGOT) {
    return (
      <div className="login">
        <input
          type="text"
          placeholder="Username"
          value={props.username}
          onChange={(e) => props.updateLoginUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={props.password}
          onChange={(e) => props.updateLoginPassword(e.target.value)}
        />
        {props.step == LoginStep.FAILED && (
          <span className="error">{props.error}</span>
        )}
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            props.forgotPassword();
          }}
        >
          Forgot Password...
        </a>
        <input
          className="loginButton"
          type="submit"
          value="Submit"
          onClick={(e) => props.submitLogin()}
        />
      </div>
    );
  } else {
    return (
      <div className="login forgot">
        <span className="questionText">
          Who was your first (hot) Grade School Teacher
        </span>
        <input
          type="text"
          id="answer"
          placeholder="Answer"
          value={props.answer}
          onChange={(e) => props.updateLoginAnswer(e.target.value)}
        />
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            props.forgotPassword();
          }}
        >
          Go Back
        </a>
        <input
          className="forgotButton"
          type="submit"
          value="Submit"
          onClick={(e) => props.submitForgot()}
        />
      </div>
    );
  }
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
  submitForgot,
  forgotPassword,
  rememberedPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
