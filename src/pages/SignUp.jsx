import AuthContainer from "../components/Login&Signup/AuthContainer";
import "../styles/auth.css";

const SignUp = () => {
  return (
    <div className="main-container">
      <div className="page-wrapper">
        <AuthContainer initialView="signup" />
      </div>
    </div>
  );
};

export default SignUp;
