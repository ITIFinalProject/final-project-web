import React from "react";
import AuthContainer from "../components/AuthContainer";

const Login = () => {
  return (
    <div className="page-wrapper">
      <AuthContainer initialView="signin" />
    </div>
  );
};

export default Login;
