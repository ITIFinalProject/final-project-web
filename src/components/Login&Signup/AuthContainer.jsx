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
      className={`container ${
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
                <span>Already have an account?</span>
                <a onClick={handleSignInClick}>Log In</a>
              </>
            ) : (
              <>
                <span>Don't have an account?</span>
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
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Log In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className="ghost"
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
