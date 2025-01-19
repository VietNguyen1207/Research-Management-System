import { ProtectedRoutes } from "../routes/ProtectedRoutes";

const studentNavItems = ["Group", "Registration", "Research", "Paper"];

export const StudentLayout = () => {
  return (
    <ProtectedRoutes allowedRoles={["student"]} navItems={studentNavItems} />
  );
};
