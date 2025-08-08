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

// Helper function to check if a ban has expired
const isBanExpired = (bannedAt) => {
  if (!bannedAt) return false; // If no ban date, consider ban as still active

  const banDate = new Date(bannedAt);
  const now = new Date();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  return now - banDate > thirtyDaysInMs;
};

// Helper function to format date for ban messages
const formatBanExpiryDate = (bannedAt) => {
  try {
    console.log("Formatting ban expiry for:", bannedAt);
    const banDate = new Date(bannedAt);
    console.log("Ban date:", banDate);
    const expiryDate = new Date(banDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    console.log("Expiry date:", expiryDate);

    // Check if date is valid
    if (isNaN(expiryDate.getTime())) {
      console.log("Invalid date detected, using fallback");
      return "30 days from now";
    }

    const formattedDate = expiryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log("Formatted date:", formattedDate);
    return formattedDate;
  } catch (error) {
    console.error("Error formatting ban expiry date:", error);
    return "30 days from now";
  }
};

// Helper function to check user status and handle bans
const checkAndHandleUserStatus = async (userData, uid) => {
  const { status, bannedAt } = userData;

  if (status === "disabled") {
    await signOut(auth);
    return {
      allowed: false,
      // error: "Your account has been disabled. Please contact support.",
    };
  }

  if (status === "banned") {
    // If user is banned but no bannedAt timestamp, set it now (for legacy banned users)
    if (!bannedAt) {
      const newBannedAt = new Date().toISOString();
      await setDoc(
        doc(db, "users", uid),
        {
          bannedAt: newBannedAt,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      // Block access - ban just started
      await signOut(auth);
      return {
        allowed: false,
        error: `Your account has been banned until ${formatBanExpiryDate(
          newBannedAt
        )}. Please contact support if you believe this is an error.`,
      };
    }

    // Check if ban has expired
    if (isBanExpired(bannedAt)) {
      // Ban has expired, reactivate the user
      await setDoc(
        doc(db, "users", uid),
        {
          status: "active",
          bannedAt: null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return { allowed: true, error: null };
    } else {
      // Ban is still active
      await signOut(auth);
      return {
        allowed: false,
        // error: `Your account has been banned until ${formatBanExpiryDate(
        //   bannedAt
        // )}. Please contact support if you believe this is an error.`,
      };
    }
  }

  return { allowed: true, error: null };
};

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
      imagePath: "", // Default empty profile image
      status: "active", // Default status for new users
      // ممكن نشبل دول عادي ..
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add a small delay to ensure Firestore write is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

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

    // Check user status in Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const statusCheck = await checkAndHandleUserStatus(
        userData,
        userCredential.user.uid
      );

      if (!statusCheck.allowed) {
        return {
          user: null,
          error: statusCheck.error,
        };
      }
    }

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
        imagePath: user.photoURL || "", // Use Google profile image if available
        status: "active", // Default status for new users
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Add a small delay to ensure Firestore write is complete for new users
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      // Check if existing user status (disabled/banned)
      const userData = userDoc.data();
      const statusCheck = await checkAndHandleUserStatus(userData, user.uid);

      if (!statusCheck.allowed) {
        return {
          user: null,
          error: statusCheck.error,
        };
      }
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
        imagePath: user.photoURL || "", // Use Facebook profile image if available
        status: "active", // Default status for new users
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Add a small delay to ensure Firestore write is complete for new users
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      // Check if existing user status (disabled/banned)
      const userData = userDoc.data();
      const statusCheck = await checkAndHandleUserStatus(userData, user.uid);

      if (!statusCheck.allowed) {
        return {
          user: null,
          error: statusCheck.error,
        };
      }
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

// Check if user account is active
export const checkUserStatus = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let currentStatus = userData.status || "active";
      let bannedAtTimestamp = userData.bannedAt;

      // If user is banned but no bannedAt timestamp, set it now (for legacy banned users)
      if (currentStatus === "banned" && !bannedAtTimestamp) {
        bannedAtTimestamp = new Date().toISOString();
        await setDoc(
          doc(db, "users", uid),
          {
            bannedAt: bannedAtTimestamp,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // If user is banned, check if ban has expired
      if (currentStatus === "banned" && isBanExpired(bannedAtTimestamp)) {
        // Ban has expired, reactivate the user
        await setDoc(
          doc(db, "users", uid),
          {
            status: "active",
            bannedAt: null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        currentStatus = "active";
        bannedAtTimestamp = null;
      }

      return {
        isActive: currentStatus === "active",
        status: currentStatus,
        bannedAt: bannedAtTimestamp,
        banExpiryDate:
          currentStatus === "banned" && bannedAtTimestamp
            ? new Date(
                new Date(bannedAtTimestamp).getTime() + 30 * 24 * 60 * 60 * 1000
              )
            : null,
        error: null,
      };
    } else {
      return { isActive: false, status: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error checking user status:", error);
    return { isActive: false, status: null, error: error.message };
  }
};

// Update user status (for admin use - this function can be used by admin dashboard)
// export const updateUserStatus = async (uid, status) => {
//   try {
//     const updateData = {
//       status,
//       updatedAt: new Date().toISOString(),
//     };

//     // If setting to banned, add the ban timestamp
//     if (status === "banned") {
//       updateData.bannedAt = new Date().toISOString();
//     } else if (status === "active") {
//       // If reactivating, clear ban timestamp
//       updateData.bannedAt = null;
//     }

//     await setDoc(doc(db, "users", uid), updateData, { merge: true });

//     return { error: null };
//   } catch (error) {
//     console.error("Error updating user status:", error);
//     return { error: error.message };
//   }
// };
