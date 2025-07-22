import { IoLogoFacebook, IoLogoGoogle, IoLogoLinkedin } from "react-icons/io5";

const LoginForm = () => {
  return (
    <div className="form-container sign-in-container">
      <form>
        <h1 className="title">Log in</h1>
        <div className="social-container">
          <a href="#" className="social">
            <IoLogoFacebook />
          </a>
          <a href="#" className="social">
            <IoLogoGoogle />
          </a>
          <a href="#" className="social">
            <IoLogoLinkedin />
          </a>
        </div>
        <span>or use your account</span>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <a href="#">Forgot your password?</a>
        <button>Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
