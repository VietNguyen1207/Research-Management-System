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
import ProjectQuota from "../pages/office/ProjectQuota";
import FundDisbursementRequest from "../pages/office/FundDisbursementRequest";
import FundDisbursementRequestDetails from "../pages/office/FundDisbursmentRequestDetails";
import QuotaDetails from "../pages/office/QuotaDetails";
import RequestRecord from "../pages/lecturer/RequestRecord";
import { useSelector } from "react-redux";
import UserManagement from "../pages/admin/UserManagement";

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
          { path: "request-record", element: <RequestRecord /> },
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
          <ProtectedRoutes allowedRoles={["department", "office"]}>
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
          { path: "quota-management", element: <OfficeQuota /> },
          { path: "project-quota/:departmentId", element: <ProjectQuota /> },
          { path: "quota-details/:quotaId", element: <QuotaDetails /> },
          { path: "fund-disbursement", element: <FundDisbursementRequest /> },
          {
            path: "fund-disbursement-details/:disbursementId",
            element: <FundDisbursementRequestDetails />,
          },
          { path: "create-council", element: <CreateCouncil /> },
          { path: "manage-council", element: <ManageCouncil /> },
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes allowedRoles={["admin"]}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          { path: "admin/users", element: <UserManagement /> },
          { path: "admin/projects", element: <div>Projects Management</div> },
          { path: "admin/quotas", element: <div>Quotas Management</div> },
          { path: "admin/timelines", element: <div>Timelines Management</div> },
          { path: "admin/dashboard", element: <UserManagement /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
];

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 0;

  const routeElement = useRoutes(routes);

  return routeElement;
};

export default AppRoutes;
