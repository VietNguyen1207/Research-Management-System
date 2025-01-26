import { Routes, Route, useRoutes, Navigate, Outlet } from "react-router-dom";
import { StandardLayout } from "../layouts/StandardLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import Login from "../pages/Login";
import CreateGroup from "../pages/CreateGroup";
import ViewGroup from "../pages/ViewGroup";
import ManageGroup from "../pages/ManageGroup";
import DepartmentQuota from "../pages/DepartmentQuota";
import OfficeQuota from "../pages/office/OfficeQuota";
import Unauthorized from "../pages/error/Unauthorized";
import RegisterResearch from "../pages/RegisterResearch";
import RegisterConference from "../pages/lecturer/RegisterConference";
import RegisterCaseStudy from "../pages/lecturer/RegisterCaseStudy";
import PendingRequest from "../pages/PendingRequest";

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
          <ProtectedRoutes allowedRoles={["student", "lecturer"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          { path: "register-research", element: <RegisterResearch /> },
          { path: "create-group", element: <CreateGroup /> },
          { path: "view-groups", element: <ViewGroup /> },
          { path: "manage-group", element: <ManageGroup /> },
          // Add other student routes here
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["lecturer"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          // Add other lecturer routes here
          {
            path: "register-conference-paper",
            element: <RegisterConference />,
          },
          {
            path: "register-case-study-paper",
            element: <RegisterCaseStudy />,
          },
        ],
      },
      // {
      //   path: "",
      //   element: (
      //     <ProtectedRoutes allowedRoles={["lecturer","department", "office"]}>
      //       <Outlet />
      //     </ProtectedRoutes>
      //   ),
      //   children: [
      //     // Add department head routes here
      //     { path: "pending-request", element: <PendingRequest /> },
      //     { path: "department-quota", element: <DepartmentQuota /> },
      //   ],
      // },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["department", "office"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          // Add department head routes here
          { path: "pending-request", element: <PendingRequest /> },
          { path: "department-quota", element: <DepartmentQuota /> },
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["office"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          // Add office routes here
          { path: "office-quota", element: <OfficeQuota /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <Outlet />
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
