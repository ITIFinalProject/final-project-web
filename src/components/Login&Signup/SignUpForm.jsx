import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoLogoGoogle, IoLogoFacebook, IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  signUpWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  getUserData,
} from "../../services/authService";
import { setAuthState } from "../../redux/slices/authSlice";
import { signUpSchema } from "../../schemas";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");

    try {
      const { user, error } = await signUpWithEmailAndPassword(
        data.email,
        data.password,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        }
      );

      if (error) {
        setAuthError(error);
      } else if (user) {
        // Immediately fetch and set user data in Redux after successful signup
        try {
          console.log("Fetching user data after signup for UID:", user.uid);
          const { userData: firestoreData } = await getUserData(user.uid);
          console.log("Fetched user data:", firestoreData);

          if (firestoreData) {
            dispatch(
              setAuthState({
                currentUser: user,
                userData: firestoreData,
                loading: false,
              })
            );
            console.log("Redux state updated successfully after signup");
          } else {
            console.warn(
              "No user data found in Firestore after signup - auth listener will handle this"
            );
          }
        } catch (fetchError) {
          console.error("Error fetching user data after signup:", fetchError);
        }
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
      const { user, error } = await signInWithGoogle();

      if (error) {
        setAuthError(error);
      } else if (user) {
        // Immediately fetch and set user data in Redux after successful signin
        try {
          const { userData: firestoreData } = await getUserData(user.uid);
          if (firestoreData) {
            dispatch(
              setAuthState({
                currentUser: user,
                userData: firestoreData,
                loading: false,
              })
            );
          }
        } catch (fetchError) {
          console.error(
            "Error fetching user data after Google signin:",
            fetchError
          );
        }
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
      const { user, error } = await signInWithFacebook();

      if (error) {
        setAuthError(error);
      } else if (user) {
        // Immediately fetch and set user data in Redux after successful signin
        try {
          const { userData: firestoreData } = await getUserData(user.uid);
          if (firestoreData) {
            dispatch(
              setAuthState({
                currentUser: user,
                userData: firestoreData,
                loading: false,
              })
            );
          }
        } catch (fetchError) {
          console.error(
            "Error fetching user data after Facebook signin:",
            fetchError
          );
        }
        navigate("/");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="title auth-title">Create Account</h1>

        {authError && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {authError}
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

        <span className="auth-span">or use your email for registration</span>

        <input
          type="text"
          placeholder="Name"
          className={`auth-input ${errors.name ? "error" : ""}`}
          {...register("name")}
          disabled={loading}
        />
        {errors.name && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.name.message}
          </span>
        )}

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

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`auth-input ${errors.password ? "error" : ""}`}
            {...register("password")}
            disabled={loading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </button>
        </div>
        {errors.password && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.password.message}
          </span>
        )}

        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`auth-input ${errors.confirmPassword ? "error" : ""}`}
            {...register("confirmPassword")}
            disabled={loading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.confirmPassword.message}
          </span>
        )}

        <input
          type="tel"
          placeholder="Phone Number"
          className={`auth-input ${errors.phone ? "error" : ""}`}
          {...register("phone")}
          disabled={loading}
        />
        {errors.phone && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.phone.message}
          </span>
        )}

        <input
          type="text"
          placeholder="Address"
          className={`auth-input ${errors.address ? "error" : ""}`}
          {...register("address")}
          disabled={loading}
        />
        {errors.address && (
          <span
            className="error-text"
            style={{ color: "red", fontSize: "12px" }}
          >
            {errors.address.message}
          </span>
        )}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
