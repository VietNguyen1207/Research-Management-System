import { Routes, Route, useRoutes, Navigate, Outlet } from "react-router-dom";
import { StandardLayout } from "../layouts/StandardLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import Login from "../pages/Login";
import CreateGroup from "../pages/CreateGroup";
import ViewGroup from "../pages/ViewGroup";
import ManageGroup from "../pages/ManageGroup";
import DepartmentQuota from "../pages/DepartmentQuota";
import OfficeQuota from "../pages/office/OfficeQuota";
import AssignQuota from "../pages/office/AssignQuota";
import Unauthorized from "../pages/error/Unauthorized";
import RegisterResearch from "../pages/RegisterResearch";
import RegisterPaper from "../pages/lecturer/RegisterPaper";
// import RegisterCaseStudy from "../pages/lecturer/RegisterCaseStudy";
import PendingRequest from "../pages/PendingRequest";
import ProjectDetails from "../pages/ProjectDetails";
import ActiveResearch from "../pages/ActiveResearch";
import ResearchArchive from "../pages/ResearchArchive";
import ActivePaper from "../pages/lecturer/ActivePaper";
import ActivePaperDetails from "../pages/lecturer/ActivePaperDetails";
import ActiveJournalDetails from "../pages/lecturer/ActiveJournalDetails";
import CreateCouncil from "../pages/office/CreateCouncil";
import ManageCouncil from "../pages/office/ManageCouncil";
import Timeline from "../pages/office/TimelineManagement";
import TimelineManagement from "../pages/office/TimelineManagement";
import TimelineSequenceManagement from "../pages/office/TimelineSequenceManagement";
import AllTimelines from "../pages/office/AllTimelines";
import ReviewProject from "../pages/lecturer/ReviewProject";
import ProjectQuota from "../pages/office/ProjectQuota";
import FundDisbursementRequest from "../pages/office/FundDisbursementRequest";
import FundDisbursementPendingRequest from "../pages/office/FundDisbursementPendingRequest";
// import FundDisbursementRequestDetails from "../pages/office/FundDisbursementRequestDetails";
import QuotaDetails from "../pages/office/QuotaDetails";
import RequestRecord from "../pages/lecturer/RequestRecord";
import { useSelector } from "react-redux";
import UserManagement from "../pages/admin/UserManagement";
import AssignTimeline from "../pages/office/AssignTimeline";
import ProjectRequestDetail from "../pages/lecturer/ProjectRequestDetail";
import TimelineSchedule from "../pages/TimelineSchedule";
import CouncilRequestRecord from "../pages/lecturer/CouncilRequestRecord";
import ProjectPaper from "../pages/lecturer/ProjectPaper";
import ReviewSchedule from "../pages/lecturer/ReviewSchedule";
import AssignReview from "../pages/office/AssignReview";
import CreateAssessmentCouncil from "../pages/office/CreateAssessmentCouncil";
import CreateInspectionCouncil from "../pages/office/CreateInspectionCouncil";
import CouncilReviewedRequests from "../pages/lecturer/CouncilReviewedRequests";

// Component for role-based redirection
const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    const role = user.role;
    if (role === "lecturer" || role === "student" || role === "researcher") {
      return <Navigate to="/timeline-schedule" replace />;
    } else if (role === "office") {
      return <Navigate to="/timeline-management" replace />;
    } else if (role === "department") {
      return <Navigate to="/active-research" replace />;
    } else if (role === "admin") {
      return <Navigate to="/admin/users" replace />;
    }
  }

  // Fallback to research project registration
  return <Navigate to="/register-research-project" replace />;
};

export const routes = [
  {
    path: "/",
    element: <StandardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <RoleBasedRedirect />
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
          <ProtectedRoutes allowedRoles={["lecturer", "researcher"]}>
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
            path: "active-paper-details/:conferenceId",
            element: <ActivePaperDetails />,
          },
          {
            path: "journal-details/:journalId",
            element: <ActiveJournalDetails />,
          },
          { path: "project-papers/:projectId", element: <ProjectPaper /> },
          { path: "request-record", element: <RequestRecord /> },
          {
            path: "council-request-records",
            element: <CouncilRequestRecord />,
          },
        ],
      },
      {
        path: "",
        element: (
          <ProtectedRoutes
            allowedRoles={[
              "lecturer",
              "department",
              "office",
              "student",
              "researcher",
            ]}
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
            path: "research-archive",
            element: <ResearchArchive />,
          },
          {
            path: "review-project",
            element: <ReviewProject />,
          },
          {
            path: "project-request/:requestId",
            element: <ProjectRequestDetail />,
          },
          { path: "timeline-schedule", element: <TimelineSchedule /> },
          {
            path: "review-schedule",
            element: <ReviewSchedule />,
          },
          {
            path: "council-reviewed-requests/:councilGroupId",
            element: <CouncilReviewedRequests />,
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
          { path: "assign-quota", element: <AssignQuota /> },
          { path: "project-quota/:departmentId", element: <ProjectQuota /> },
          { path: "quota-details/:quotaId", element: <QuotaDetails /> },
          { path: "fund-disbursement", element: <FundDisbursementRequest /> },
          {
            path: "pending-disbursements",
            element: <FundDisbursementPendingRequest />,
          },
          // {
          //   path: "fund-disbursement-details/:disbursementId",
          //   element: <FundDisbursementRequestDetails />,
          // },
          { path: "create-council", element: <CreateCouncil /> },
          {
            path: "create-assessment-council",
            element: <CreateAssessmentCouncil />,
          },
          {
            path: "create-inspection-council",
            element: <CreateInspectionCouncil />,
          },
          { path: "manage-council", element: <ManageCouncil /> },
          { path: "assign-timeline", element: <AssignTimeline /> },
          {
            path: "timeline-sequence-management",
            element: <TimelineSequenceManagement />,
          },
          { path: "assign-review", element: <AssignReview /> },
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
