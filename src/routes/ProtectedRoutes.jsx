// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import NavBar from "../components/NavBar";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import PropTypes from "prop-types";

// export const ProtectedRoutes = ({
//   allowedRoles = [],
//   navItems = [],
//   requiresGuest = false,
// }) => {
//   const { user } = useSelector((state) => state.auth);

//   // If user is not logged in, redirect to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // If user's role is not allowed, redirect to unauthorized
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return (
//     <div className="min-h-screen w-full overflow-auto scrollbar-hide">
//       <Header />
//       <NavBar allowedItems={navItems} />
//       <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// ProtectedRoutes.propTypes = {
//   allowedRoles: PropTypes.arrayOf(PropTypes.string),
//   navItems: PropTypes.arrayOf(PropTypes.string),
// };

// ProtectedRoutes.defaultProps = {
//   allowedRoles: [],
//   navItems: [],
// };

import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export const ProtectedRoutes = ({
  children,
  allowedRoles = [],
  requiresGuest = false,
}) => {
  const { user } = useSelector((state) => state.auth);

  // For routes that require guest access (like login)
  if (requiresGuest) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // For protected routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiresGuest: PropTypes.bool,
};

ProtectedRoutes.defaultProps = {
  allowedRoles: [],
  requiresGuest: false,
};
