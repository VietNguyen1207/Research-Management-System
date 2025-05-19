/**
 * This file contains all the enum mappings used throughout the application.
 * Centralizing these mappings ensures consistency and easier maintenance.
 */

// Project Type enum mapping
export const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

// Project Status enum mapping
export const PROJECT_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Work in progress",
  3: "Rejected",
  4: "Completed",
  5: "Completion Requested",
  6: "Completion Approved",
  7: "Completion Rejected",
};

// Document Type enum mapping
export const DOCUMENT_TYPE = {
  0: "Project Proposal",
  1: "Disbursement",
  2: "Council Decision",
  3: "Conference Proposal",
  4: "Journal Paper",
  5: "Disbursement Confirmation",
  6: "Project Completion",
  7: "Conference Paper",
  8: "Conference Expense",
  9: "Conference Expense Decision",
  10: "Conference Funding",
  11: "Journal Funding",
  12: "Funding Confirmation",
};

// Fund Disbursement Type enum mapping
export const FUND_DISBURSEMENT_TYPE = {
  0: "Project Phase",
  1: "Conference Expense",
  2: "Conference Funding",
  3: "Journal Funding",
};

// Project Phase Status enum mapping
export const PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
};

// Member Role enum mapping
export const MEMBER_ROLE = {
  0: "Leader",
  1: "Member",
  2: "Supervisor",
  3: "Council_Chairman",
  4: "Secretary",
  5: "Council_Member",
  6: "Stakeholder",
};

// Member Status enum mapping
export const MEMBER_STATUS = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
  3: "Rejected",
};

// Request Type enum mapping
export const REQUEST_TYPE = {
  1: "Research Creation",
  2: "Phase Update",
  3: "Completion",
  4: "Paper Creation",
  5: "Conference Creation",
  6: "Fund Disbursement",
  7: "Conference Expense",
};

// Approval Status enum mapping
export const APPROVAL_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

// Group Member Role enum mapping
export const GROUP_MEMBER_ROLE = {
  0: "Leader",
  1: "Member",
  2: "Supervisor",
  3: "Council Chairman",
  4: "Secretary",
  5: "Council Member",
  6: "Stakeholder",
};

// Project Phase Status enum mapping (specific naming for ProjectRequestDetail)
export const PROJECT_PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
};

// Color mappings for statuses
export const STATUS_COLORS = {
  0: "gold", // Pending
  1: "green", // Approved
  2: "red", // Rejected
};

// Color mappings for phase statuses
export const PHASE_STATUS_COLORS = {
  0: "blue", // In Progress
  1: "gold", // Pending
  2: "green", // Completed
  3: "red", // Overdue
};

// Project Resource Type enum mapping
export const PROJECT_RESOURCE_TYPE = {
  1: "Human",
  2: "Equipment",
  3: "Software",
  4: "Document",
  5: "Material",
  6: "Personnel",
  7: "Facility",
  8: "Travel",
  9: "Conference",
  10: "Journal",
  11: "Dataset",
  12: "Other",
};

// Resource Status enum mapping
export const RESOURCE_STATUS = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  4: "Cancelled",
  5: "Completed",
};

// Also add resource status colors for consistency
export const RESOURCE_STATUS_COLORS = {
  1: "gold", // Pending
  2: "green", // Approved
  3: "red", // Rejected
  4: "gray", // Cancelled
  5: "blue", // Completed
};
