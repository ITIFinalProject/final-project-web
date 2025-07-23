import React from "react";
import AuthContainer from "../components/Login&Signup/AuthContainer";
import "../styles/auth.css";

const Login = () => {
  return (
    <div className="main-container">
      <div className="page-wrapper">
        <AuthContainer initialView="signin" />
      </div>
    </div>
  );
};

export default Login;
