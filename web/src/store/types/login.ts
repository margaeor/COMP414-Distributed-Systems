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
