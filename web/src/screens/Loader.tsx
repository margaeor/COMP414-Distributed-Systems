import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { retry } from "../store/actions";
import { selectError, selectLoader, selectMessage } from "../store/selectors";
import { State, LoaderStep } from "../store/types";
import { connect } from "react-redux";

interface IProps {
  step: LoaderStep;
  error: string;
  message: string;
  retry: typeof retry;
}

const Loader = ({ step, error, message, retry }: IProps) => {
  return (
    <div className="loader">
      <Icon path={mdiLoading} spin={true} className="loader__icon" />
      <div className="loader__text">
        <span className="loader__text__normal">{message}</span>
        {step == LoaderStep.FAILED && (
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
