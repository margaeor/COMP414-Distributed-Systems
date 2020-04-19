import React from "react";

const Login: React.FunctionComponent = () => {
  return (
    <div>
      <form action="">
        <input type="text" id="fname" name="fname" />
        <input type="text" id="lname" name="lname" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
