import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectAuthChecked } from "../features/auth/authSlice";

export const ProtectedRoutes = ({
  children,
  allowedRoles = [],
  requiresGuest = false,
}) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const authChecked = useSelector(selectAuthChecked);

  // Show loading or nothing while checking auth
  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F2722B]"></div>
      </div>
    );
  }

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
    // Special case: if route allows "lecturer" and user is "researcher", allow access
    if (allowedRoles.includes("lecturer") && user.role === "researcher") {
      return <>{children}</>;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiresGuest: PropTypes.bool,
};
