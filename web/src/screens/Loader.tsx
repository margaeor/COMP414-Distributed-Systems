import { mdiAlertCircleOutline, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { connect } from "react-redux";
import { retry } from "../store/actions";
import { selectError, selectLoader, selectMessage } from "../store/selectors";
import { LoaderStep, State } from "../store/types";

interface IProps {
  step: LoaderStep;
  error: string;
  message: string;
  forcedMessage?: string;
  retry: typeof retry;
}

const Loader = ({ step, error, message, forcedMessage, retry }: IProps) => {
  return (
    <div className="loader">
      {step === LoaderStep.FAILED ? (
        <Icon path={mdiAlertCircleOutline} className="loader__icon" />
      ) : (
        <Icon path={mdiLoading} spin={true} className="loader__icon" />
      )}
      <div className="loader__text">
        <span className="loader__text__normal">
          {forcedMessage ? forcedMessage : message}
        </span>
        {step === LoaderStep.FAILED && (
          <>
            <span className="loader__text__error">{error}</span>
            <button className="loader__text__retry" onClick={retry}>
              Retry
            </button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
