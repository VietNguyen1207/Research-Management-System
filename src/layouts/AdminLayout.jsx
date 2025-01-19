import { ProtectedRoutes } from "../routes/ProtectedRoutes";

const adminNavItems = [
  "Group",
  "Registration",
  "Research",
  "Paper",
  "Request",
  "Quotas",
  "Menu",
];

export const AdminLayout = () => {
  return <ProtectedRoutes allowedRoles={["admin"]} navItems={adminNavItems} />;
};
