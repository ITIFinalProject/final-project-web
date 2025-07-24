import AuthContainer from "../components/Login&Signup/AuthContainer";
import "../styles/auth.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
