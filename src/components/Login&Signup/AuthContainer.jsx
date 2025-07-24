import React, { useState, useEffect, useCallback } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import "../../styles/auth.css";

const SMALL_SCREEN_BREAKPOINT = 675;

const AuthContainer = ({ initialView = "signin" }) => {
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= SMALL_SCREEN_BREAKPOINT
  );
  const [isSignUpActive, setIsSignUpActive] = useState(
    initialView === "signup"
  );

  const handleResize = useCallback(() => {
    setIsMobileView(window.innerWidth <= SMALL_SCREEN_BREAKPOINT);
  }, []);

  useEffect(() => {
    setIsMobileView(window.innerWidth <= SMALL_SCREEN_BREAKPOINT);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    setIsSignUpActive(initialView === "signup");
  }, [initialView]);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  return (
    <div
      className={`container auth-container ${
        !isMobileView && isSignUpActive ? "right-panel-active" : ""
      }`}
      id="container"
    >
      {isMobileView ? (
        <>
          {isSignUpActive ? <SignUpForm /> : <LoginForm />}
          <div className="container">
            {isSignUpActive ? (
              <>
                <span className="auth-span">Already have an account?</span>
                <a onClick={handleSignInClick}>Log In</a>
              </>
            ) : (
              <>
                <span className="auth-span">Don't have an account?</span>
                <a onClick={handleSignUpClick}>Sign Up</a>
              </>
            )}
          </div>
        </>
      ) : (
        // Desktop view: Show both forms with overlay logic
        <>
          <SignUpForm />
          <LoginForm />
          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="auth-title">Welcome Back!</h1>
                <p className="auth-text">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost auth-button"
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Log In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="auth-title">Hello, Friend!</h1>
                <p className="auth-text">
                  Enter your personal details and start journey with us
                </p>
                <button
                  className="ghost auth-button"
                  id="signUp"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthContainer;
