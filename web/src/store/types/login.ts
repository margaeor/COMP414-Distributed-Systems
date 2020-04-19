export enum LoginStep {
  FORM,
  FORGOT,
  FAILED,
}

export interface LoginState {
  step: LoginStep;
  username: String;
  password: String;
  answer: String;
  error: String;
}

export const NULL_LOGIN_STATE: LoginState = {
  step: LoginStep.FORM,
  username: "",
  password: "",
  answer: "",
  error: "",
};
