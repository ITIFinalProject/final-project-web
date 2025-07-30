import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io5";
import {
  loginWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  resetPassword,
} from "../../services/authService";
import { loginSchema } from "../../schemas";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");

    try {
      const { user, error } = await loginWithEmailAndPassword(
        data.email,
        data.password
      );

      if (error) {
        setAuthError(error);
      } else if (user) {
        navigate("/");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError("");

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setAuthError(error);
      } else {
        navigate("/");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setAuthError("");

    try {
      const { error } = await signInWithFacebook();

      if (error) {
        setAuthError(error);
      } else {
        navigate("/");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = getValues("email");

    if (!email) {
      setAuthError("Please enter your email first");
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setAuthError(error);
      } else {
        setResetEmailSent(true);
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="title auth-title">Log in</h1>

        {authError && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {authError}
          </div>
        )}

        {resetEmailSent && (
          <div
            className="success-message"
            style={{ color: "green", marginBottom: "10px" }}
          >
            Password reset email sent! Check your inbox.
          </div>
        )}

        <div className="social-container">
          <button
            type="button"
            className="social social-link"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <IoLogoGoogle />
          </button>
          <button
            type="button"
            className="social social-link"
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            <IoLogoFacebook />
          </button>
        </div>

        <span className="auth-span">or use your account</span>

        <input
          type="email"
          placeholder="Email"
          className={`auth-input ${errors.email ? "error" : ""}`}
          {...register("email")}
          disabled={loading}
        />
        {errors.email && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          placeholder="Password"
          className={`auth-input ${errors.password ? "error" : ""}`}
          {...register("password")}
          disabled={loading}
        />
        {errors.password && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.password.message}
          </span>
        )}

        <button
          type="button"
          className="reset-password-link"
          onClick={handlePasswordReset}
          disabled={loading}
        >
          Forgot your password?
        </button>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing In..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
