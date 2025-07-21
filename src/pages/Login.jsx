import React from "react";
import AuthContainer from "../components/Login&Signup/AuthContainer";

const Login = () => {
  return (
    <div className="page-wrapper">
      <AuthContainer initialView="signin" />
    </div>
  );
};

export default Login;
