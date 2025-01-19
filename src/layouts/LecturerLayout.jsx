import { ProtectedRoutes } from "../routes/ProtectedRoutes";

const lecturerNavItems = [
  "Group",
  "Registration",
  "Research",
  "Paper",
  "Request",
];

export const LecturerLayout = () => {
  return (
    <ProtectedRoutes allowedRoles={["lecturer"]} navItems={lecturerNavItems} />
  );
};
