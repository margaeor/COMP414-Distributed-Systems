export const START_LOADING = "START_LOADING";
export const STOP_LOADING = "STOP_LOADING";
export const LOADING_FAILED = "LOADING_FAILED";
export const RETRY_LOADING = "RETRY_LOADING";
export const CANCEL_LOADING = "CANCEL_LOADING";

export interface LoadingStartAction {
  type: typeof START_LOADING;
  message: string;
}

export interface LoadingFailedAction {
  type: typeof LOADING_FAILED;
  message?: string;
  error: string;
  canExit: boolean;
  canRetry: boolean;
}

export interface LoadingStopAction {
  type: typeof STOP_LOADING;
}

export function startLoading(message: string): LoadingStartAction {
  return {
    type: START_LOADING,
    message,
  };
}

export function stopLoading(): LoadingStopAction {
  return {
    type: STOP_LOADING,
  };
}

export function loadingFailed(
  error: string,
  message?: string,
  canRetry = true,
  canExit = false
) {
  return {
    type: LOADING_FAILED,
    message,
    error,
    canExit,
    canRetry,
  };
}

export function retry() {
  return {
    type: RETRY_LOADING,
  };
}

export function cancelLoading() {
  return {
    type: CANCEL_LOADING,
  };
}
