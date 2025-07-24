import { IoLogoFacebook, IoLogoGoogle, IoLogoLinkedin } from "react-icons/io5";

const SignUpForm = () => {
  return (
    <div className="form-container sign-up-container">
      <form className="auth-form">
        <h1 className="title auth-title">Create Account</h1>
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
        <span className="auth-span">or use your email for registration</span>
        <input type="text" placeholder="Name" className="auth-input" />
        <input type="email" placeholder="Email" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input"
        />
        <input type="tel" placeholder="Phone Number" className="auth-input" />
        <input type="text" placeholder="Address" className="auth-input" />
        <button className="auth-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
