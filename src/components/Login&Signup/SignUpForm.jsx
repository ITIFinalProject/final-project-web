import { IoLogoFacebook, IoLogoGoogle, IoLogoLinkedin } from "react-icons/io5";

const SignUpForm = () => {
  return (
    <div className="form-container sign-up-container">
      <form>
        <h1>Create Account</h1>
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
        <span>or use your email for registration</span>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <input type="tel" placeholder="Phone Number" />
        <input type="text" placeholder="Address" />
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
