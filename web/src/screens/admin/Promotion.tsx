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
    <div className="promotion">
      <span className="header">Change User Privileges</span>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <ul className="roles">
        <li>
          <input
            id="admin"
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          <label htmlFor="admin">Admin</label>
        </li>
        <li>
          <input
            id="officer"
            type="checkbox"
            checked={officer}
            onChange={(e) => setOfficer(e.target.checked)}
          />
          <label htmlFor="officer">Officer</label>
        </li>
      </ul>
      <button
        disabled={!isAdmin}
        onClick={(e) => submitChange(username, admin, officer)}
      >
        Submit
      </button>
    </div>
  );
};

export default Promotion;
