export const START_LOADING = "START_LOADING";
export const STOP_LOADING = "STOP_LOADING";
export const LOADING_FAILED = "LOADING_FAILED";
export const RETRY_LOADING = "RETRY_LOADING";

export interface LoadingStartAction {
  type: typeof START_LOADING;
  message: string;
}

export interface LoadingFailedAction {
  type: typeof LOADING_FAILED;
  message?: string;
  error: string;
}

export function startLoading(message: string): LoadingStartAction {
  return {
    type: START_LOADING,
    message,
  };
}

export function stopLoading() {
  return {
    type: STOP_LOADING,
  };
}

export function loadingFailed(error: string, message?: string) {
  return {
    type: LOADING_FAILED,
    message,
    error,
  };
}

export function retry() {
  return {
    type: RETRY_LOADING,
  };
}
