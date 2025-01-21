import { Routes, Route, useRoutes, Navigate, Outlet } from "react-router-dom";
import { StandardLayout } from "../layouts/StandardLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
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
          <ProtectedRoutes allowedRoles={["student", "lecturer"]}>
            <Outlet />
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
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          // Add other lecturer routes here
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["head_department"]}>
            <Outlet />
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
            <Outlet />
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
