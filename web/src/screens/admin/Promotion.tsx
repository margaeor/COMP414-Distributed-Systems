import React, { useState } from "react";
import { changePrivileges } from "../../store/actions";

const Promotion = ({
  isAdmin,
  submitChange,
}: {
  isAdmin: boolean;
  submitChange: typeof changePrivileges;
}) => {
  const [username, setUsername] = useState("");
  const [officer, setOfficer] = useState(false);
  const [admin, setAdmin] = useState(false);

  return (
    <form className="promotion form">
      <span className="form__header">Change User Privileges</span>
      <input
        className="form__input form__input--first"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <span className="form__label">Permissions</span>
      <div className="form__check">
        <input
          id="admin"
          type="checkbox"
          checked={admin}
          onChange={(e) => setAdmin(e.target.checked)}
        />
        <label htmlFor="admin">Admin</label>
      </div>
      <div className="form__check">
        <input
          id="officer"
          type="checkbox"
          checked={officer}
          onChange={(e) => setOfficer(e.target.checked)}
        />
        <label htmlFor="officer">Official</label>
      </div>
      <div className="form__glue"></div>
      <button
        className="form__submit"
        disabled={!isAdmin}
        onClick={() => submitChange(username, admin, officer)}
      >
        {isAdmin ? "Change Privileges" : "Not an Admin"}
      </button>
    </form>
  );
};

export default Promotion;
