import { IoLogoFacebook, IoLogoGoogle, IoLogoLinkedin } from "react-icons/io5";

const LoginForm = () => {
  return (
    <div className="form-container sign-in-container">
      <form className="auth-form">
        <h1 className="title auth-title">Log in</h1>
        <div className="social-container">
          <a href="#" className="social social-link">
            <IoLogoFacebook />
          </a>
          <a href="#" className="social social-link">
            <IoLogoGoogle />
          </a>
          <a href="#" className="social social-link">
            <IoLogoLinkedin />
          </a>
        </div>
        <span className="auth-span">or use your account</span>
        <input type="email" placeholder="Email" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <a href="#" className="auth-link">
          Forgot your password?
        </a>
        <button className="auth-button">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
