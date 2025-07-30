import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Facebook Auth Provider
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

// Sign up with email and password
export const signUpWithEmailAndPassword = async (email, password, userData) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      address: userData.address || "",
      profileImageUrl: "", // Default empty profile image
      // ممكن نشبل دول عادي ..
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { user, error: null };
  } catch (error) {
    console.error("Error signing up:", error);
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error signing in:", error);
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        phone: "",
        address: "",
        profileImageUrl: user.photoURL || "", // Use Google profile image if available
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { user, error: null };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { user: null, error: error.message };
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        phone: "",
        address: "",
        profileImageUrl: user.photoURL || "", // Use Facebook profile image if available
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { user, error: null };
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return { userData: null, error: error.message };
  }
};

// Update user data in Firestore
export const updateUserData = async (uid, userData) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...userData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Update Firebase Auth profile if name changed
    if (userData.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: userData.name,
      });
    }

    return { error: null };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { error: error.message };
  }
};

// Update user password
export const updateUserPassword = async (newPassword) => {
  try {
    if (!auth.currentUser) {
      return { error: "No user is currently signed in" };
    }

    await updatePassword(auth.currentUser, newPassword);
    return { error: null };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: error.message };
  }
};

// Update user profile image URL
export const updateUserProfileImage = async (uid, imagePath) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        imagePath,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { error: null };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { error: error.message };
  }
};
