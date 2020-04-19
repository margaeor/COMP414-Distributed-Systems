export enum LoginStep {
  FORM,
  FORGOT,
  FAILED,
}

export interface LoginState {
  step: LoginStep;
  username: string;
  password: string;
  answer: string;
  error: string;
}

export const NULL_LOGIN_STATE: LoginState = {
  step: LoginStep.FORM,
  username: "",
  password: "",
  answer: "",
  error: "",
};
