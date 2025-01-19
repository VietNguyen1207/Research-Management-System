// import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
// import { StandardLayout } from "../layouts/StandardLayout";
// import { ProtectedRoutes } from "./ProtectedRoutes";
// import { Outlet } from "react-router-dom";
// import Login from "../pages/Login";
// import { AdminLayout } from "../layouts/AdminLayout";
// import Unauthorized from "../pages/error/Unauthorized";
// import RegisterResearch from "../pages/RegisterResearch";
// import { useSelector } from "react-redux";

// const studentNavItems = ["Group", "Registration", "Research", "Paper"];
// const lecturerNavItems = [
//   "Group",
//   "Registration",
//   "Research",
//   "Paper",
//   "Request",
// ];
// const deptHeadNavItems = ["Research", "Paper", "Request", "Quotas", "Menu"];
// const officeNavItems = ["Research", "Paper", "Request", "Quotas"];
// const adminNavItems = [
//   "Group",
//   "Registration",
//   "Research",
//   "Paper",
//   "Request",
//   "Quotas",
//   "Menu",
// ];

// export const routes = [
//   {
//     path: "/",
//     element: <StandardLayout />,
//     children: [
//       {
//         index: true,
//         element: (
//           <ProtectedRoutes>
//             <Navigate to="/register-research" replace />
//           </ProtectedRoutes>
//         ),
//       },
//       { path: "login", element: <Login /> },
//       { path: "unauthorized", element: <Unauthorized /> },
//       {
//         path: "",
//         element: (
//           <ProtectedRoutes
//             allowedRoles={["student"]}
//             navItems={studentNavItems}
//           >
//             <Outlet />
//           </ProtectedRoutes>
//         ),
//         children: [
//           { path: "register-research", element: <RegisterResearch /> },
//           //   { path: "group", element: <Group /> },
//           //   { path: "research", element: <Research /> },
//           //   { path: "papers", element: <Papers /> },
//         ],
//       },
//       {
//         path: "",
//         element: (
//           <ProtectedRoutes
//             allowedRoles={["lecturer"]}
//             navItems={lecturerNavItems}
//           >
//             <Outlet />
//           </ProtectedRoutes>
//         ),
//         children: [
//           { path: "register-research", element: <RegisterResearch /> },
//           //   { path: "group", element: <Group /> },
//           //   { path: "research", element: <Research /> },
//           //   { path: "papers", element: <Papers /> },
//           //   { path: "request", element: <Request /> },
//         ],
//       },
//       {
//         path: "",
//         element: (
//           <ProtectedRoutes
//             allowedRoles={["head_department"]}
//             navItems={deptHeadNavItems}
//           >
//             <Outlet />
//           </ProtectedRoutes>
//         ),
//         children: [
//           //   { path: "research", element: <Research /> },
//           //   { path: "papers", element: <Papers /> },
//           //   { path: "request", element: <Request /> },
//           //   { path: "quotas", element: <Quotas /> },
//         ],
//       },
//       {
//         path: "",
//         element: (
//           <ProtectedRoutes
//             allowedRoles={["office_scientific"]}
//             navItems={officeNavItems}
//           >
//             <Outlet />
//           </ProtectedRoutes>
//         ),
//         children: [
//           //   { path: "research", element: <ResearchOffice /> },
//           //   { path: "papers", element: <PapersOffice /> },
//           //   { path: "request", element: <RequestOffice /> },
//           //   { path: "quotas", element: <QuotasOffice /> },
//         ],
//       },
//     ],
//   },
//   {
//     path: "/admin",
//     element: (
//       <ProtectedRoutes allowedRoles={["admin"]} navItems={adminNavItems}>
//         <AdminLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       // { index: true, element: <AdminDashboard /> },
//     ],
//   },
//   {
//     path: "*",
//     element: <Navigate to="/unauthorized" replace />,
//   },
// ];

// const AppRoutes = () => {
//   const element = useRoutes(routes);
//   return element;
// };

// export default AppRoutes;

import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import { StandardLayout } from "../layouts/StandardLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { StudentLayout } from "../layouts/StudentLayout";
import { LecturerLayout } from "../layouts/LecturerLayout";
import { DeptHeadLayout } from "../layouts/DeptHeadLayout";
import { OfficeLayout } from "../layouts/OfficeLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Unauthorized from "../pages/error/Unauthorized";
import RegisterResearch from "../pages/RegisterResearch";

export const routes = [
  {
    path: "/",
    element: <StandardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Navigate to="/register-research" replace />
          </ProtectedRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedRoutes requiresGuest>
            <Login />
          </ProtectedRoutes>
        ),
      },
      { path: "unauthorized", element: <Unauthorized /> },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoutes>
        ),
        children: [
          { path: "register-research", element: <RegisterResearch /> },
          // Add other student routes here
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["lecturer"]}>
            <LecturerLayout />
          </ProtectedRoutes>
        ),
        children: [
          { path: "register-research", element: <RegisterResearch /> },
          // Add other lecturer routes here
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["head_department"]}>
            <DeptHeadLayout />
          </ProtectedRoutes>
        ),
        children: [
          // Add department head routes here
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["office_scientific"]}>
            <OfficeLayout />
          </ProtectedRoutes>
        ),
        children: [
          // Add office routes here
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      // Add admin routes here
    ],
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
];

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

export default AppRoutes;
