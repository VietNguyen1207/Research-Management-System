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
import RegisterPaper from "../pages/lecturer/RegisterPaper";
// import RegisterCaseStudy from "../pages/lecturer/RegisterCaseStudy";
import PendingRequest from "../pages/PendingRequest";
import ProjectDetails from "../pages/ProjectDetails";
import ActiveResearch from "../pages/ActiveResearch";
import ActivePaper from "../pages/lecturer/ActivePaper";
import ActivePaperDetails from "../pages/lecturer/ActivePaperDetails";
import CreateCouncil from "../pages/office/CreateCouncil";
import ManageCouncil from "../pages/office/ManageCouncil";
import Timeline from "../pages/office/TimelineManagement";
import TimelineManagement from "../pages/office/TimelineManagement";
import AllTimelines from "../pages/office/AllTimelines";
import ReviewProject from "../pages/lecturer/ReviewProject";

export const routes = [
  {
    path: "/",
    element: <StandardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Navigate to="/register-research-project" replace />
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
          { path: "create-group", element: <CreateGroup /> },
          { path: "view-group", element: <ViewGroup /> },
          { path: "manage-group", element: <ManageGroup /> },
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
          { path: "register-research-project", element: <RegisterResearch /> },
          {
            path: "register-paper",
            element: <RegisterPaper />,
          },
          {
            path: "active-paper",
            element: <ActivePaper />,
          },
          {
            path: "active-paper-details",
            element: <ActivePaperDetails />,
          },
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes
            allowedRoles={["lecturer", "department", "office", "student"]}
          >
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          { path: "pending-request", element: <PendingRequest /> },
          {
            path: "project-details/:projectId",
            element: <ProjectDetails />,
          },
          // {
          //   path: "project-details",
          //   element: <ProjectDetails />,
          // },
          {
            path: "active-research",
            element: <ActiveResearch />,
          },
          {
            path: "review-project",
            element: <ReviewProject />,
          },
        ],
      },
      //Department + Office
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["department", "office", "admin"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          { path: "department-quota", element: <DepartmentQuota /> },
          { path: "timeline-management", element: <TimelineManagement /> },
          {
            path: "/all-timelines",
            element: <AllTimelines />,
          },
        ],
      },
      // Office
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["office"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          { path: "office-quota", element: <OfficeQuota /> },
          { path: "create-council", element: <CreateCouncil /> },
          { path: "manage-council", element: <ManageCouncil /> },
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
    children: [],
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
