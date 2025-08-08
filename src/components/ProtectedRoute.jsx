// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../redux/hooks";

// const ProtectedRoute = ({ children }) => {
//   const { currentUser, loading } = useAuth();

//   if (loading) {
//     return (
//       <div
//         className="loading-container"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return currentUser ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../redux/hooks";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, statusError } = useAuth();

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return currentUser && !statusError ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
