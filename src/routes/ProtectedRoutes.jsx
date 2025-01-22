import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export const ProtectedRoutes = ({
  children,
  allowedRoles = [],
  requiresGuest = false,
}) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  console.log(allowedRoles);

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

  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiresGuest: PropTypes.bool,
};
