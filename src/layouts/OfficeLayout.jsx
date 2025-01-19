import { ProtectedRoutes } from "../routes/ProtectedRoutes";

const officeNavItems = ["Research", "Paper", "Request", "Quotas"];

export const OfficeLayout = () => {
  return (
    <ProtectedRoutes
      allowedRoles={["office_scientific"]}
      navItems={officeNavItems}
    />
  );
};
