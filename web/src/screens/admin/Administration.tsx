import React from "react";
import { connect } from "react-redux";
import { changePrivileges, createTournament } from "../../store/actions";
import { selectError, selectUser } from "../../store/selectors";
import { State, User } from "../../store/types";
import "./Administration.scss";
import Promotion from "./Promotion";
import Tournament from "./Tournament";

interface IProps {
  createTournament: typeof createTournament;
  changePrivileges: typeof changePrivileges;
  error: string;
  user: User;
}

const Administration = ({
  user,
  error,
  createTournament,
  changePrivileges,
}: IProps) => {
  return (
    <div className="administration">
      {error !== "" && <span className="error">{error}</span>}
      <Promotion isAdmin={user.admin} submitChange={changePrivileges} />
      <Tournament
        isOfficer={user.officer}
        submitTournament={createTournament}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: selectUser(state),
    error: selectError(state),
  };
};

const mapDispatchToProps = {
  createTournament,
  changePrivileges,
};

export default connect(mapStateToProps, mapDispatchToProps)(Administration);
