import { ProtectedRoutes } from "../routes/ProtectedRoutes";

const deptHeadNavItems = ["Research", "Paper", "Request", "Quotas", "Menu"];

export const DeptHeadLayout = () => {
  return (
    <ProtectedRoutes
      allowedRoles={["head_department"]}
      navItems={deptHeadNavItems}
    />
  );
};
