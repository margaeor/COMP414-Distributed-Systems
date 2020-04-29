import { mdiAlertCircleOutline, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { connect } from "react-redux";
import { retry, cancelLoading } from "../store/actions";
import { selectError, selectLoader, selectMessage } from "../store/selectors";
import { LoaderStep, State } from "../store/types";

interface IProps {
  step: LoaderStep;
  error: string;
  message: string;
  forcedMessage?: string;
  retry: typeof retry;
  cancelLoading: typeof cancelLoading;
}

const Loader = ({
  step,
  error,
  message,
  forcedMessage,
  retry,
  cancelLoading,
}: IProps) => {
  const failed =
    step === LoaderStep.FAILED ||
    step === LoaderStep.FAILED_CAN_EXIT ||
    step === LoaderStep.FAILED_ONLY_EXIT;

  const canRetry =
    step === LoaderStep.FAILED || step === LoaderStep.FAILED_CAN_EXIT;
  const canExit =
    step === LoaderStep.FAILED_ONLY_EXIT || step === LoaderStep.FAILED_CAN_EXIT;

  return (
    <div className="loader">
      {failed ? (
        <Icon path={mdiAlertCircleOutline} className="loader__icon" />
      ) : (
        <Icon path={mdiLoading} spin={true} className="loader__icon" />
      )}
      <div className="loader__text">
        <span className="loader__text__normal">
          {forcedMessage ? forcedMessage : message}
        </span>
        {failed && (
          <>
            <span className="loader__text__error">{error}</span>
            {canRetry && (
              <button className="loader__text__retry" onClick={retry}>
                Retry
              </button>
            )}
            {canExit && (
              <button className="loader__text__retry" onClick={cancelLoading}>
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    step: selectLoader(state),
    error: selectError(state),
    message: selectMessage(state),
  };
};

const mapDispatchToProps = {
  retry,
  cancelLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
