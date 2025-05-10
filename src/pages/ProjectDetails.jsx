import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Timeline,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  message,
  Dropdown,
  Space,
  Upload,
  Progress,
  List,
  Avatar,
  Tabs,
  Statistic,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Typography,
  Select,
  Collapse,
  Descriptions,
  Spin,
  Empty,
  Divider,
  Badge,
  Steps,
  Drawer,
  Checkbox,
} from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  UserOutlined,
  EditOutlined,
  MoreOutlined,
  UploadOutlined,
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
  InboxOutlined,
  FileOutlined,
  DownloadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  BankOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  useGetProjectDetailsQuery,
  useUpdateProjectPhaseMutation,
  useGetProjectCompletionSummaryQuery,
  useRequestProjectCompletionMutation,
  useUploadCompletionDocumentsMutation,
  useUploadProjectDocumentMutation,
} from "../features/project/projectApiSlice";
import {
  useRequestFundDisbursementMutation,
  useUploadDisbursementDocumentMutation,
} from "../features/fund-disbursement/fundDisbursementApiSlice";
import {
  useCreateConferenceFromResearchMutation,
  useCreateJournalFromResearchMutation,
} from "../features/project/conference/conferenceApiSlice";
import dayjs from "dayjs";

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Step } = Steps;

// Define role mapping
const MEMBER_ROLE = {
  0: "Leader",
  1: "Member",
  2: "Supervisor",
  3: "Member", // Assuming 3 is also a member type, adjust if needed
};

// Define status mapping
const MEMBER_STATUS = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
  3: "Rejected",
};

// Project Type enum mapping
const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

// Project Status enum mapping
const PROJECT_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Closed",
  3: "Rejected",
  4: "Completed",
  5: "Completion Requested",
  6: "Completion Approved",
  7: "Completion Rejected",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
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

// Project Phase Status enum mapping
const PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
};

// Helper function to get document icon and color based on type
const getDocumentTypeVisuals = (type) => {
  switch (type) {
    case 0: // Project Proposal
      return {
        icon: <FileTextOutlined />,
        color: "blue",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
      };
    case 1: // Disbursement
      return {
        icon: <DollarOutlined />,
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
      };
    case 2: // Council Decision
      return {
        icon: <BankOutlined />,
        color: "purple",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
      };
    case 3: // Conference Proposal
      return {
        icon: <ProjectOutlined />,
        color: "orange",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      };
    case 4: // Journal Paper
      return {
        icon: <FileOutlined />,
        color: "cyan",
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-600",
      };
    case 5: // Disbursement Confirmation
      return {
        icon: <CheckCircleOutlined />,
        color: "lime",
        bgColor: "bg-lime-100",
        textColor: "text-lime-600",
      };
    case 6: // Project Completion
      return {
        icon: <CheckOutlined />,
        color: "gold",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
      };
    case 7: // Conference Paper
      return {
        icon: <FileTextOutlined />,
        color: "blue",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
      };
    default:
      return {
        icon: <PaperClipOutlined />,
        color: "default",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
      };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Format as dd/mm/yyyy
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get projectId from the URL if not provided through params
  const searchParams = new URLSearchParams(location.search);
  const queryProjectId = searchParams.get("projectId");

  const currentProjectId = projectId || queryProjectId;

  const [activeSection, setActiveSection] = useState("overview");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [phasesForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [fundRequestModalVisible, setFundRequestModalVisible] = useState(false);
  const [selectedPhaseForFunding, setSelectedPhaseForFunding] = useState(null);
  const [fundRequestForm] = Form.useForm();
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [completionStep, setCompletionStep] = useState("preview"); // 'preview' or 'form'
  const [completionForm] = Form.useForm();
  const [createPaperModalVisible, setCreatePaperModalVisible] = useState(false);
  const [createPaperForm] = Form.useForm();
  const [createJournalForm] = Form.useForm();
  const [createConferenceForm] = Form.useForm();
  const [uploadDocumentForm] = Form.useForm();
  const [isUploadDocumentModalVisible, setIsUploadDocumentModalVisible] =
    useState(false);
  const [createConferenceFromResearch, { isLoading: isCreatingConference }] =
    useCreateConferenceFromResearchMutation();
  const [createJournalFromResearch, { isLoading: isCreatingJournal }] =
    useCreateJournalFromResearchMutation();
  const [uploadProjectDocument, { isLoading: isUploadingProjectDocument }] =
    useUploadProjectDocumentMutation();
  const [paperType, setPaperType] = useState("conference");

  const {
    data: projectDetailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProjectDetailsQuery(currentProjectId, {
    skip: !currentProjectId,
  });

  const projectDetails = projectDetailsData?.data;

  const [requestFundDisbursement, { isLoading: isSubmittingRequest }] =
    useRequestFundDisbursementMutation();
  const [uploadDisbursementDocument, { isLoading: isUploadingDocuments }] =
    useUploadDisbursementDocumentMutation();
  const [updateProjectPhase, { isLoading: isUpdatingPhase }] =
    useUpdateProjectPhaseMutation();

  const { data: completionSummaryData, isLoading: isLoadingCompletionSummary } =
    useGetProjectCompletionSummaryQuery(currentProjectId, {
      skip: !currentProjectId || !completionModalVisible,
    });

  const completionSummary = completionSummaryData?.data;

  const [requestProjectCompletion, { isLoading: isSubmittingCompletion }] =
    useRequestProjectCompletionMutation();
  const [uploadCompletionDocuments, { isLoading: isUploadingCompletionDocs }] =
    useUploadCompletionDocumentsMutation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (projectDetails) {
      console.log("Project budget details:", {
        approvedBudget: projectDetails.approvedBudget,
        spentBudget: projectDetails.spentBudget,
        calculatedPercentage:
          projectDetails.approvedBudget > 0
            ? (
                (projectDetails.spentBudget / projectDetails.approvedBudget) *
                100
              ).toFixed(1)
            : 0,
      });
    }
  }, [projectDetails]);

  const handleDownloadDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleUpdatePhase = (phase) => {
    setSelectedPhase(phase);
    setIsModalVisible(true);

    phasesForm.setFieldsValue({
      title: phase.title,
      startDate: phase.startDate ? dayjs(phase.startDate) : null,
      endDate: phase.endDate ? dayjs(phase.endDate) : null,
      status: phase.status.toString(),
      spentBudget: phase.spentBudget || 0,
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await phasesForm.validateFields();

      // Format date values to ISO string
      const formattedValues = {
        projectPhaseId: selectedPhase.projectPhaseId,
        title: values.title,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        status: parseInt(values.status),
        spentBudget: values.spentBudget,
      };

      console.log("Updating project phase with values:", formattedValues);

      // Call the API
      const response = await updateProjectPhase({
        projectPhaseId: selectedPhase.projectPhaseId,
        data: formattedValues,
      }).unwrap();

      message.success("Project phase updated successfully");
      setIsModalVisible(false);

      // Refetch project details to update any changes
      refetch();
    } catch (error) {
      console.error("Failed to update phase:", error);
      message.error(
        error.data?.message ||
          "Failed to update project phase. Please try again."
      );
    }
  };

  const showMemberDetails = (member) => {
    setSelectedMember(member);
    setDrawerVisible(true);
  };

  const showFundRequestModal = (phase) => {
    setSelectedPhaseForFunding(phase);
    setFundRequestModalVisible(true);
    fundRequestForm.resetFields();

    // Set default values including the spent budget as the requested amount
    fundRequestForm.setFieldsValue({
      phaseId: phase.projectPhaseId,
      phaseTitle: phase.title,
      requestedAmount: phase.spentBudget || 0, // Set amount to phase's spent budget
      purpose: `Funding for completed phase: ${phase.title}`,
    });
  };

  const handleFundRequestSubmit = async () => {
    try {
      const values = await fundRequestForm.validateFields();

      // Step 1: Create the fund disbursement request
      const requestPayload = {
        fundRequest: values.requestedAmount,
        description: values.purpose,
        projectId: parseInt(currentProjectId),
        projectPhaseId: selectedPhaseForFunding.projectPhaseId,
      };

      console.log("Sending fund request payload:", requestPayload);

      // First, create the fund disbursement request
      const response = await requestFundDisbursement(requestPayload).unwrap();
      console.log("Fund disbursement response:", response);

      // Get the disbursementId from the response
      const disbursementId = response.data?.disbursementId;

      // Step 2: Upload documents if documents are provided and we have a disbursementId
      if (disbursementId && values.documentationFiles?.length > 0) {
        // Create a single FormData for all files
        const formData = new FormData();

        // Append each file to the formData with the key 'documentFiles'
        values.documentationFiles.forEach((file) => {
          formData.append("documentFiles", file.originFileObj);
        });

        try {
          // Upload all documents in a single request
          await uploadDisbursementDocument({
            disbursementId,
            formData: formData,
          }).unwrap();

          console.log(`All documents uploaded successfully`);
          message.success("All documents uploaded successfully!");
        } catch (fileError) {
          console.error(`Failed to upload files:`, fileError);
          message.warning(
            `Failed to upload documents. ${
              fileError.data?.message || "Please try again."
            }`
          );
        }
      }

      message.success("Fund disbursement request submitted successfully!");
      setFundRequestModalVisible(false);

      // Refetch project details to update any changes
      refetch();
    } catch (error) {
      console.error("Fund request failed:", error);
      message.error(
        error.data?.message ||
          "Failed to submit fund disbursement request. Please try again."
      );
    }
  };

  const handleCompletionRequest = () => {
    setCompletionModalVisible(true);
    setCompletionStep("preview");
  };

  const handleCompletionSubmit = async (values) => {
    try {
      // Step 1: Submit the completion request
      const completionData = {
        completionSummary: values.projectOutcomes,
        budgetReconciled: values.budgetReconciled,
        budgetVarianceExplanation: values.budgetVarianceExplanation || "",
      };

      const completionResponse = await requestProjectCompletion({
        projectId: currentProjectId,
        completionData,
      }).unwrap();

      // Step 2: Upload completion documents if provided
      if (values.completionDocuments?.length > 0) {
        const formData = new FormData();

        values.completionDocuments.forEach((file) => {
          formData.append("documentFiles", file.originFileObj);
        });

        await uploadCompletionDocuments({
          projectId: currentProjectId,
          formData,
        }).unwrap();
      }

      message.success("Project completion request submitted successfully!");
      setCompletionModalVisible(false);
      refetch(); // Refresh project data
    } catch (error) {
      console.error("Failed to submit completion request:", error);
      message.error(
        error.data?.message ||
          "Failed to submit completion request. Please try again."
      );
    }
  };

  // Group documents by type when rendering
  const groupedDocuments = projectDetails?.documents?.reduce((acc, doc) => {
    const type = doc.documentType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {});

  const handleCreatePaperClick = () => {
    setCreatePaperModalVisible(true);
    createConferenceForm.resetFields();
    createJournalForm.resetFields();
    setPaperType("conference");
  };

  const handleCreatePaperSubmit = async () => {
    try {
      if (paperType === "conference") {
        const values = await createConferenceForm.validateFields();

        // Send the API request for conference paper
        await createConferenceFromResearch({
          projectId: currentProjectId,
          conferenceData: {
            conferenceName: values.conferenceName,
            conferenceRanking: parseInt(values.conferenceRanking),
            presentationType: parseInt(values.presentationType),
          },
        }).unwrap();

        message.success("Conference paper created successfully!");
      } else {
        const values = await createJournalForm.validateFields();

        // Send the API request for journal paper
        await createJournalFromResearch({
          projectId: currentProjectId,
          journalData: {
            journalName: values.journalName,
            publisherName: values.publisherName,
          },
        }).unwrap();

        message.success("Journal paper created successfully!");
      }

      setCreatePaperModalVisible(false);

      // Optionally navigate to a new page or refresh the current one
      // navigate(`/conference-projects`);
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error(`Failed to create ${paperType} paper:`, error);
        message.error(
          error.data?.message ||
            `Failed to create ${paperType} paper. Please try again.`
        );
      }
    }
  };

  const handleUploadClick = () => {
    setIsUploadDocumentModalVisible(true);
    uploadDocumentForm.resetFields();
  };

  const handleUploadDocumentSubmit = async () => {
    try {
      const values = await uploadDocumentForm.validateFields();

      if (values.documentFiles?.length > 0) {
        const formData = new FormData();

        // Add document type to the form data
        formData.append("documentType", values.documentType);

        // Add files to the form data
        values.documentFiles.forEach((file) => {
          formData.append("documentFiles", file.originFileObj);
        });

        // Call the upload API
        await uploadProjectDocument({
          projectId: currentProjectId,
          formData: formData,
        }).unwrap();

        message.success("Documents uploaded successfully!");
        setIsUploadDocumentModalVisible(false);
        refetch(); // Refresh project data
      } else {
        message.error("Please select at least one file to upload");
      }
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to upload documents:", error);
        message.error(
          error.data?.message || "Failed to upload documents. Please try again."
        );
      }
    }
  };

  if (!currentProjectId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-10 rounded-2xl shadow-xl">
              <div className="text-red-500 text-6xl mb-6">
                <InfoCircleOutlined />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                Project Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                No project ID was provided. Please select a project to view
                details.
              </p>
              <Button
                size="large"
                type="primary"
                onClick={() => navigate("/active-research")}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
              >
                Go to Active Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Spin size="large" />
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Loading project details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-2xl shadow-xl"
          >
            <div className="text-red-500 text-6xl mb-6">
              <CloseOutlined />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Error Loading Project
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {error?.data?.message ||
                "Failed to load project details. Please try again later."}
            </p>
            <Button
              size="large"
              type="primary"
              onClick={() => refetch()}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-2xl shadow-xl"
          >
            <div className="text-yellow-500 text-6xl mb-6">
              <InfoCircleOutlined />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Project Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The requested project could not be found.
            </p>
            <Button
              size="large"
              type="primary"
              onClick={() => navigate("/active-research")}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
            >
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group members by role for better organization
  const groupedMembers = projectDetails.group?.members?.reduce(
    (acc, member) => {
      const role = MEMBER_ROLE[member.role] || "Member";
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    },
    {}
  );

  // Calculate phase progress
  const completedPhases =
    projectDetails.projectPhases?.filter((p) => p.status === 2)?.length || 0;
  const totalPhases = projectDetails.projectPhases?.length || 0;
  const progressPercentage =
    totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  const allPhasesCompleted = completedPhases === totalPhases;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg"
          >
            Back to Projects
          </Button>
        </div>

        {/* Enhanced Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="shadow-lg rounded-2xl border-0 overflow-hidden mb-8"
            bodyStyle={{ padding: 0 }}
          >
            <div className="relative">
              {/* Improved gradient background with better height */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#F2722B] to-[#FFA500] opacity-90"></div>

              <div className="relative px-6 pb-6">
                {/* Top section with header content */}
                <div className="pt-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <ProjectOutlined className="text-[#F2722B] text-3xl" />
                    </div>
                    <div className="ml-4 mt-4">
                      <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                        {projectDetails.projectName}
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <Tag
                      color={
                        projectDetails.status === 0
                          ? "gold"
                          : projectDetails.status === 1
                          ? "green"
                          : projectDetails.status === 2
                          ? "blue"
                          : projectDetails.status === 3
                          ? "red"
                          : projectDetails.status === 4
                          ? "cyan"
                          : projectDetails.status === 5
                          ? "purple"
                          : projectDetails.status === 6
                          ? "success"
                          : projectDetails.status === 7
                          ? "volcano"
                          : "default"
                      }
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      {PROJECT_STATUS[projectDetails.status]}
                    </Tag>

                    {/* Existing completion button when all phases completed */}
                    {allPhasesCompleted && projectDetails.status === 1 && (
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={handleCompletionRequest}
                        className="mt-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-md"
                      >
                        Request Completion
                      </Button>
                    )}
                  </div>
                </div>

                {/* Bottom section with additional info */}
                <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner flex flex-col md:flex-row justify-between">
                  <div className="flex flex-wrap gap-3 mb-3 md:mb-0">
                    <Tag
                      icon={<FolderOutlined />}
                      color="blue"
                      className="px-2 py-0.5 text-sm rounded-md border-0 flex items-center"
                    >
                      {PROJECT_TYPE[projectDetails.projectType]}
                    </Tag>
                    <Tag
                      icon={<TeamOutlined />}
                      color="cyan"
                      className="px-2 py-0.5 text-sm rounded-md border-0 flex items-center"
                    >
                      {projectDetails.department?.departmentName}
                    </Tag>
                    <Tag
                      icon={<CalendarOutlined />}
                      color="purple"
                      className="px-2 py-0.5 text-sm rounded-md border-0 flex items-center"
                    >
                      {formatDate(projectDetails.startDate)} -{" "}
                      {formatDate(projectDetails.endDate)}
                    </Tag>
                  </div>

                  <div className="flex gap-3">
                    <Statistic
                      title="Budget"
                      value={projectDetails.approvedBudget}
                      precision={0}
                      formatter={(value) => (
                        <span className="text-[#F2722B] font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(value)}
                        </span>
                      )}
                      className="mr-2"
                    />
                    <Statistic
                      title="Progress"
                      value={
                        (projectDetails.projectPhases?.filter(
                          (phase) => phase.status === 3
                        ).length /
                          (projectDetails.projectPhases?.length || 1)) *
                        100
                      }
                      precision={0}
                      suffix="%"
                      className="text-[#F2722B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Project Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <DollarOutlined className="text-green-500 text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Budget</Text>}
                    value={projectDetails.approvedBudget}
                    prefix="₫"
                    valueStyle={{ color: "#22c55e" }}
                    formatter={(value) => `${value.toLocaleString()}`}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <TeamOutlined className="text-blue-500 text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Team Members</Text>}
                    value={projectDetails.group?.members?.length || 0}
                    valueStyle={{ color: "#3b82f6" }}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <CalendarOutlined className="text-[#F2722B] text-3xl mb-2" />
                  <Statistic
                    title={
                      <Text className="text-gray-500">Timeline (Days)</Text>
                    }
                    value={
                      new Date(projectDetails.endDate) -
                      new Date(projectDetails.startDate)
                    }
                    formatter={(value) =>
                      Math.ceil(value / (1000 * 60 * 60 * 24))
                    }
                    valueStyle={{ color: "#F2722B" }}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <CheckOutlined className="text-[#FFA500] text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Progress</Text>}
                    value={progressPercentage}
                    suffix="%"
                    valueStyle={{ color: "#FFA500" }}
                  />
                  <Progress
                    percent={progressPercentage}
                    showInfo={false}
                    strokeColor={{
                      "0%": "#F2722B",
                      "100%": "#FFA500",
                    }}
                    className="mt-2"
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <BankOutlined className="text-purple-500 text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Budget Usage</Text>}
                    value={
                      projectDetails.approvedBudget > 0
                        ? (projectDetails.spentBudget /
                            projectDetails.approvedBudget) *
                          100
                        : 0
                    }
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: "#8b5cf6" }}
                  />
                  <Text className="text-gray-500 text-sm block mt-1">
                    ₫{projectDetails.spentBudget?.toLocaleString()} of ₫
                    {projectDetails.approvedBudget?.toLocaleString()}
                  </Text>
                  <Progress
                    percent={
                      projectDetails.approvedBudget > 0
                        ? (
                            (projectDetails.spentBudget /
                              projectDetails.approvedBudget) *
                              100 || 0
                          ).toFixed(1)
                        : 0
                    }
                    showInfo={false}
                    strokeColor="#8b5cf6"
                    className="mt-2"
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeSection}
          onChange={setActiveSection}
          type="card"
          size="large"
          className="project-tabs mb-6"
          tabBarStyle={{
            marginBottom: 24,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <TabPane
            tab={
              <Space>
                <InfoCircleOutlined />
                Overview
              </Space>
            }
            key="overview"
          />
          <TabPane
            tab={
              <Space>
                <TeamOutlined />
                Group
              </Space>
            }
            key="team"
          />
          <TabPane
            tab={
              <Space>
                <CalendarOutlined />
                Project Phases
              </Space>
            }
            key="phases"
          />
          <TabPane
            tab={
              <Space>
                <FileTextOutlined />
                Documents
              </Space>
            }
            key="documents"
          />
        </Tabs>

        {/* Dynamic Content Based on Active Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Project Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="shadow-md rounded-xl border-0 overflow-hidden"
                title={
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-lg font-medium">
                        Project Information
                      </span>
                    </div>

                    {/* Add Paper Project button*/}
                    {projectDetails.status === 1 && (
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={handleCreatePaperClick}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md"
                      >
                        Create Paper
                      </Button>
                    )}
                  </div>
                }
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <div className="bg-gray-50 p-5 rounded-xl h-full">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">
                        Description
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {projectDetails.description}
                      </p>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    {projectDetails.methodology && (
                      <div className="bg-gray-50 p-5 rounded-xl h-full">
                        <h3 className="text-lg font-medium mb-4 text-gray-800">
                          Methodology
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {projectDetails.methodology}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Descriptions
                      title="Project Details"
                      bordered
                      column={1}
                      size="small"
                      className="rounded-xl overflow-hidden"
                      labelStyle={{ fontWeight: 600 }}
                    >
                      <Descriptions.Item label="Project ID">
                        {projectDetails.projectId}
                      </Descriptions.Item>
                      <Descriptions.Item label="Department">
                        {projectDetails.department?.departmentName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Group">
                        {projectDetails.groupName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Timeline">
                        {formatDate(projectDetails.startDate)} -{" "}
                        {formatDate(projectDetails.endDate)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Budget">
                        ₫{projectDetails.approvedBudget?.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Spent Budget">
                        ₫{projectDetails.spentBudget?.toLocaleString()}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col xs={24} md={12}>
                    <Descriptions
                      title="Creator Information"
                      bordered
                      column={1}
                      size="small"
                      className="rounded-xl overflow-hidden"
                      labelStyle={{ fontWeight: 600 }}
                    >
                      <Descriptions.Item label="Created By">
                        {projectDetails.createdByUser?.fullName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Username">
                        {projectDetails.createdByUser?.username}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        <a
                          href={`mailto:${projectDetails.createdByUser?.email}`}
                        >
                          {projectDetails.createdByUser?.email}
                        </a>
                      </Descriptions.Item>
                      <Descriptions.Item label="Created At">
                        {formatDate(projectDetails.createdAt)}
                      </Descriptions.Item>
                      {projectDetails.approvedByUser && (
                        <>
                          <Descriptions.Item label="Approved By">
                            {projectDetails.approvedByUser.fullName}
                          </Descriptions.Item>
                          <Descriptions.Item label="Approver Email">
                            <a
                              href={`mailto:${projectDetails.approvedByUser?.email}`}
                            >
                              {projectDetails.approvedByUser?.email}
                            </a>
                          </Descriptions.Item>
                        </>
                      )}
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Project Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className="shadow-md rounded-xl border-0"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-lg font-medium">
                        Project Timeline
                      </span>
                    </div>
                    <div>
                      <Badge
                        count={`${completedPhases}/${totalPhases}`}
                        className="site-badge-count-4"
                        style={{ backgroundColor: "#10b981" }}
                      />
                    </div>
                  </div>
                }
              >
                {totalPhases > 0 ? (
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-gray-500">Overall Progress</div>
                        <div className="font-medium">{progressPercentage}%</div>
                      </div>
                      <Progress
                        percent={progressPercentage}
                        status={
                          progressPercentage === 100 ? "success" : "active"
                        }
                        strokeColor={{
                          "0%": "#F2722B",
                          "100%": "#FFA500",
                        }}
                        strokeWidth={10}
                      />
                    </div>
                    <Steps
                      direction="vertical"
                      current={completedPhases}
                      percent={progressPercentage}
                    >
                      {projectDetails.projectPhases.map((phase) => (
                        <Step
                          key={phase.projectPhaseId}
                          title={
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{phase.title}</span>
                              <div className="flex gap-2">
                                {phase.status !== 2 && phase.status !== 3 && (
                                  <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdatePhase(phase);
                                    }}
                                  >
                                    Update
                                  </Button>
                                )}
                                {phase.status === 2 && (
                                  <Button
                                    type="primary"
                                    size="small"
                                    icon={<DollarOutlined />}
                                    onClick={() => showFundRequestModal(phase)}
                                    className="rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] border-none hover:from-[#16a34a] hover:to-[#15803d]"
                                  >
                                    Request Funds
                                  </Button>
                                )}
                              </div>
                            </div>
                          }
                          description={
                            <div className="mt-2">
                              <div className="text-gray-500 mb-2">
                                {formatDate(phase.startDate)} -{" "}
                                {formatDate(phase.endDate)}
                              </div>
                              <div className="mb-2">
                                <Tag
                                  color={
                                    phase.status === 2
                                      ? "success"
                                      : phase.status === 3
                                      ? "error"
                                      : phase.status === 1
                                      ? "warning"
                                      : "blue"
                                  }
                                >
                                  {PHASE_STATUS[phase.status]}
                                </Tag>
                                <Tag color="green" className="ml-2">
                                  <DollarOutlined className="mr-1" />₫
                                  {phase.spentBudget?.toLocaleString() || 0}
                                </Tag>
                              </div>
                            </div>
                          }
                          status={
                            phase.status === 2
                              ? "finish"
                              : phase.status === 3
                              ? "error"
                              : "process"
                          }
                        />
                      ))}
                    </Steps>
                  </div>
                ) : (
                  <Empty description="No project phases found" />
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {activeSection === "team" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0"
              title={
                <div className="flex items-center">
                  <TeamOutlined className="text-[#F2722B] mr-2" />
                  <span className="text-lg font-medium">Team Members</span>
                </div>
              }
            >
              <Row gutter={[16, 16]} className="mb-8">
                {[
                  { role: "Leader", icon: <CrownOutlined />, color: "#F2722B" },
                  {
                    role: "Member",
                    icon: <UserOutlined />,
                    color: "#3b82f6",
                  },
                  {
                    role: "Supervisor",
                    icon: <UserOutlined />,
                    color: "#8b5cf6",
                  },
                  { role: "Member", icon: <TeamOutlined />, color: "#10b981" },
                ].map((item) => {
                  const members = groupedMembers?.[item.role] || [];
                  return (
                    <Col xs={12} md={6} key={item.role}>
                      <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </div>
                        <div className="mt-3 text-gray-800 font-medium">
                          {item.role}s
                        </div>
                        <div
                          className="mt-1 text-3xl font-bold"
                          style={{ color: item.color }}
                        >
                          {members.length}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {Object.entries(groupedMembers || {}).map(([role, members]) => (
                <div key={role} className="mb-10 last:mb-0">
                  <div
                    className={`
                      flex items-center text-lg font-medium mb-4 pb-2 border-b
                      ${
                        role === "Leader"
                          ? "text-[#F2722B] border-orange-200"
                          : role === "Supervisor"
                          ? "text-purple-500 border-purple-200"
                          : role === "Member"
                          ? "text-blue-500 border-blue-200"
                          : "text-emerald-500 border-emerald-200"
                      }
                    `}
                  >
                    {role === "Leader" ? (
                      <CrownOutlined className="mr-2" />
                    ) : role === "Supervisor" ? (
                      <UserOutlined className="mr-2" />
                    ) : role === "Member" ? (
                      <UserOutlined className="mr-2" />
                    ) : (
                      <TeamOutlined className="mr-2" />
                    )}
                    {role}s ({members.length})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <motion.div
                        key={member.groupMemberId}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => showMemberDetails(member)}
                        className="cursor-pointer"
                      >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={50}
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor:
                                  role === "Leader"
                                    ? "#F2722B"
                                    : role === "Supervisor"
                                    ? "#8b5cf6"
                                    : role === "Members"
                                    ? "#3b82f6"
                                    : "#10b981",
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 text-lg">
                                {member.memberName}
                              </h3>
                              <div className="text-sm text-gray-500">
                                {member.memberEmail}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Tag
                                  color={
                                    member.status === 1 ? "success" : "warning"
                                  }
                                  className="rounded-full px-3"
                                >
                                  {MEMBER_STATUS[member.status]}
                                </Tag>
                                <div className="text-xs text-gray-500">
                                  Joined: {formatDate(member.joinDate)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {activeSection === "phases" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0 mb-6"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarOutlined className="text-[#F2722B] mr-2" />
                    <span className="text-lg font-medium">
                      Project Timeline
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      count={completedPhases}
                      className="site-badge-count-4"
                      style={{ backgroundColor: "#10b981" }}
                    />
                    <Text>of</Text>
                    <Badge
                      count={totalPhases}
                      className="site-badge-count-4"
                      style={{ backgroundColor: "#F2722B" }}
                    />
                  </div>
                </div>
              }
            >
              <div className="mb-6">
                <Row gutter={[16, 16]} className="mb-6">
                  <Col span={24}>
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <Text className="text-gray-700 font-medium">
                          Project Timeline
                        </Text>
                        <Text className="text-gray-700">
                          {formatDate(projectDetails.startDate)} -{" "}
                          {formatDate(projectDetails.endDate)}
                        </Text>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-2 bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <Text className="text-gray-500">Start</Text>
                        <Text className="text-[#F2722B] font-medium">
                          {progressPercentage}% Complete
                        </Text>
                        <Text className="text-gray-500">End</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {projectDetails.projectPhases &&
              projectDetails.projectPhases.length > 0 ? (
                <div className="space-y-6">
                  {projectDetails.projectPhases.map((phase, index) => (
                    <motion.div
                      key={phase.projectPhaseId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl"
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
                          <div className="flex-shrink-0">
                            <div
                              className={`
                              flex items-center justify-center w-12 h-12 rounded-full
                              ${
                                phase.status === 2
                                  ? "bg-green-100 text-green-600"
                                  : phase.status === 3
                                  ? "bg-red-100 text-red-600"
                                  : phase.status === 1
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-orange-100 text-[#F2722B]"
                              }
                            `}
                            >
                              {phase.status === 2 ? (
                                <CheckOutlined />
                              ) : phase.status === 3 ? (
                                <ClockCircleOutlined className="text-red-600" />
                              ) : (
                                <ClockCircleOutlined />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">
                                  {phase.title}
                                </h3>
                                <div className="text-sm text-gray-500 mt-1">
                                  <CalendarOutlined className="mr-1" />
                                  {formatDate(phase.startDate)} -{" "}
                                  {formatDate(phase.endDate)}
                                </div>
                                <div className="mt-2">
                                  <Tag color="green">
                                    <DollarOutlined className="mr-1" />₫
                                    {phase.spentBudget?.toLocaleString() || 0}
                                  </Tag>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Tag
                                  color={
                                    phase.status === 2
                                      ? "success"
                                      : phase.status === 3
                                      ? "error"
                                      : phase.status === 1
                                      ? "warning"
                                      : "blue"
                                  }
                                  className="rounded-full px-3"
                                >
                                  {PHASE_STATUS[phase.status]}
                                </Tag>
                                {phase.status !== 2 && phase.status !== 3 && (
                                  <Button
                                    type="primary"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleUpdatePhase(phase)}
                                    className="rounded-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none hover:from-[#E65D1B] hover:to-[#FF9500]"
                                  >
                                    Update
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">
                                  Budget Usage
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(
                                    (phase.spentBudget /
                                      projectDetails.approvedBudget) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                              <Progress
                                percent={
                                  phase.status === 2
                                    ? 100
                                    : phase.status === 1
                                    ? 25
                                    : phase.status === 3
                                    ? 100
                                    : 50
                                }
                                showInfo={false}
                                strokeColor={
                                  phase.status === 2
                                    ? "#10b981"
                                    : phase.status === 3
                                    ? "#ef4444"
                                    : "#F2722B"
                                }
                                status={
                                  phase.status === 3 ? "exception" : "normal"
                                }
                                strokeWidth={8}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Empty
                  description={
                    <span className="text-gray-500">
                      No project phases found
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </motion.div>
        )}

        {activeSection === "documents" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0"
              title={
                <div className="flex items-center">
                  <FileTextOutlined className="text-[#F2722B] mr-2" />
                  <span className="text-lg font-medium">Project Documents</span>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                  onClick={handleUploadClick}
                >
                  Upload New Document
                </Button>
              }
            >
              {groupedDocuments && Object.keys(groupedDocuments).length > 0 ? (
                <Collapse
                  defaultActiveKey={Object.keys(groupedDocuments)}
                  accordion
                  className="border-0 bg-transparent"
                >
                  {Object.entries(groupedDocuments).map(([docType, docs]) => {
                    const {
                      icon: DocIcon,
                      color: docColor,
                      bgColor,
                      textColor,
                    } = getDocumentTypeVisuals(parseInt(docType));

                    return (
                      <Panel
                        key={docType}
                        header={
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center mr-3`}
                              >
                                {DocIcon}
                              </div>
                              <span className={`font-medium ${textColor}`}>
                                {DOCUMENT_TYPE[docType] ||
                                  `Type ${docType} Documents`}
                              </span>
                            </div>
                            <Badge
                              count={docs.length}
                              style={{
                                backgroundColor: `var(--ant-${docColor})`,
                              }}
                            />
                          </div>
                        }
                        className="mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={docs}
                          renderItem={(doc) => (
                            <List.Item
                              actions={[
                                <Button
                                  type="primary"
                                  icon={<DownloadOutlined />}
                                  onClick={() =>
                                    handleDownloadDocument(doc.documentUrl)
                                  }
                                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                                >
                                  View
                                </Button>,
                                // Add delete button if needed
                                // <Button type="text" danger icon={<DeleteOutlined />} />
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${bgColor} ${textColor}`}
                                  >
                                    {DocIcon}
                                  </div>
                                }
                                title={
                                  <Tooltip title={doc.fileName}>
                                    <div className="font-medium text-gray-800 truncate max-w-md">
                                      {doc.fileName}
                                    </div>
                                  </Tooltip>
                                }
                                description={
                                  <div className="text-xs text-gray-500">
                                    Uploaded: {formatDate(doc.uploadAt)}
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </Panel>
                    );
                  })}
                </Collapse>
              ) : (
                <Empty
                  description={
                    <span className="text-gray-500">No documents found</span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="mt-4 bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                    onClick={handleUploadClick}
                  >
                    Upload Document
                  </Button>
                </Empty>
              )}
            </Card>
          </motion.div>
        )}
      </div>

      {/* Update Phase Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="text-[#F2722B] mr-2" />
            <span>Update Project Phase</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        confirmLoading={isUpdatingPhase}
        okButtonProps={{
          className:
            "bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none",
        }}
      >
        <Form form={phasesForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Phase Title"
            rules={[{ required: true, message: "Please enter phase title" }]}
          >
            <Input size="large" className="rounded-lg" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select a start date" },
                ]}
              >
                <DatePicker className="w-full rounded-lg" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: "Please select an end date" },
                ]}
              >
                <DatePicker className="w-full rounded-lg" size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* New Spent Budget Field */}
          <Form.Item
            name="spentBudget"
            label="Spent Budget (VND)"
            rules={[
              { required: true, message: "Please enter the spent budget" },
              {
                validator: (_, value) => {
                  if (value < 0) {
                    return Promise.reject(
                      new Error("Spent budget cannot be negative")
                    );
                  }
                  if (value > projectDetails.approvedBudget) {
                    return Promise.reject(
                      new Error(
                        `Amount cannot exceed project budget (₫${projectDetails.approvedBudget.toLocaleString()})`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              max={projectDetails.approvedBudget}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
              size="large"
            />
          </Form.Item>

          {/* Enhanced status section with explanations */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text strong className="block mb-2">
              Phase Status
            </Text>
            <Text className="text-gray-600 text-sm block mb-3">
              Updating a phase to "Completed" status will allow you to request
              fund disbursement for this phase. The "Overdue" status is
              automatically assigned by the system when a phase exceeds its end
              date.
            </Text>

            <Form.Item
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
              className="mb-0"
            >
              <Select size="large" className="rounded-lg">
                <Select.Option value="0">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-blue-500 mr-2" />
                    <span>In Progress</span>
                  </div>
                </Select.Option>
                <Select.Option value="1">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-yellow-500 mr-2" />
                    <span>Pending</span>
                  </div>
                </Select.Option>
                <Select.Option value="2">
                  <div className="flex items-center">
                    <CheckOutlined className="text-green-500 mr-2" />
                    <span>Completed</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Status-specific contextual information */}
          {phasesForm.getFieldValue("status") === "2" && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
              <div className="flex items-start">
                <InfoCircleOutlined className="text-green-600 mt-0.5 mr-2" />
                <Text className="text-green-700">
                  Once you mark this phase as completed, you will be able to
                  request fund disbursement.
                </Text>
              </div>
            </div>
          )}

          {/* Budget progress indicator */}
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <Text strong>Budget Usage</Text>
              <Text>
                {phasesForm.getFieldValue("spentBudget")
                  ? `₫${Number(
                      phasesForm.getFieldValue("spentBudget")
                    ).toLocaleString()} of ₫${projectDetails.approvedBudget.toLocaleString()}`
                  : `₫0 of ₫${projectDetails.approvedBudget.toLocaleString()}`}
              </Text>
            </div>
            <Progress
              percent={Math.round(
                ((phasesForm.getFieldValue("spentBudget") || 0) /
                  projectDetails.approvedBudget) *
                  100
              )}
              status="active"
              strokeColor={{
                "0%": "#1677ff",
                "100%": "#52c41a",
              }}
            />
          </div>
        </Form>
      </Modal>

      {/* Member Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <UserOutlined className="text-[#F2722B] mr-2" />
            <span className="text-lg font-medium">Member Details</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        {selectedMember && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{
                  backgroundColor:
                    MEMBER_ROLE[selectedMember.role] === "Leader"
                      ? "#F2722B"
                      : MEMBER_ROLE[selectedMember.role] === "Supervisor"
                      ? "#8b5cf6"
                      : MEMBER_ROLE[selectedMember.role] === "Member"
                      ? "#3b82f6"
                      : "#10b981",
                }}
              />
              <h3 className="mt-4 text-xl font-medium">
                {selectedMember.memberName}
              </h3>
              <Tag
                color={
                  MEMBER_ROLE[selectedMember.role] === "Leader"
                    ? "orange"
                    : MEMBER_ROLE[selectedMember.role] === "Supervisor"
                    ? "purple"
                    : MEMBER_ROLE[selectedMember.role] === "Members"
                    ? "blue"
                    : "green"
                }
                className="mt-2 rounded-full px-3"
              >
                {MEMBER_ROLE[selectedMember.role]}
              </Tag>
            </div>

            <Descriptions
              title="Member Information"
              bordered
              column={1}
              size="small"
              className="rounded-xl overflow-hidden"
              labelStyle={{ fontWeight: 600 }}
            >
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedMember.memberEmail}`}>
                  {selectedMember.memberEmail}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={selectedMember.status === 1 ? "success" : "warning"}
                >
                  {MEMBER_STATUS[selectedMember.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Joined Date">
                {formatDate(selectedMember.joinDate)}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {selectedMember.userId}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <Button
                type="primary"
                icon={<MailOutlined />}
                className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                onClick={() =>
                  (window.location.href = `mailto:${selectedMember.memberEmail}`)
                }
              >
                Contact Member
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Fund Request Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-green-500 mr-2" />
            <span>Request Fund Disbursement</span>
          </div>
        }
        open={fundRequestModalVisible}
        onCancel={() => setFundRequestModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
          <div className="flex items-start">
            <CheckOutlined className="text-green-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-green-700">
                Phase Completed
              </Text>
              <Text className="text-green-600 block">
                You are requesting funds for a completed project phase. The
                request will be reviewed by administrators before disbursement.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={fundRequestForm}
          layout="vertical"
          onFinish={handleFundRequestSubmit}
          className="mt-4"
        >
          <Form.Item name="phaseId" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="phaseTitle" label="Completed Phase">
            <Input disabled className="bg-gray-50" />
          </Form.Item>

          <Form.Item
            name="requestedAmount"
            label="Requested Amount (VND)"
            rules={[
              { required: true, message: "Please enter the requested amount" },
              {
                validator: (_, value) => {
                  if (!value || value < 0) {
                    return Promise.reject(
                      new Error("Amount must be non-negative")
                    );
                  }
                  if (value > projectDetails.approvedBudget) {
                    return Promise.reject(
                      new Error(
                        `Amount cannot exceed project budget (₫${projectDetails.approvedBudget.toLocaleString()})`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              max={projectDetails.approvedBudget}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
              disabled
            />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[
              {
                required: true,
                message: "Please enter the purpose of this fund request",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe how the funds will be used"
            />
          </Form.Item>

          <Form.Item
            name="documentationFiles"
            label={
              <span>
                Supporting Documentation <span style={{ color: "red" }}>*</span>
              </span>
            }
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e.slice(0, 3);
              }
              return e && e.fileList?.slice(0, 3);
            }}
            rules={[
              {
                required: true,
                message: "Please upload at least one supporting document",
              },
              {
                validator: (_, fileList) => {
                  if (fileList && fileList.length > 3) {
                    return Promise.reject("Maximum 3 files allowed");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            help="Upload up to 3 supporting documents (invoices, receipts, quotes, etc.)"
          >
            <Upload.Dragger
              name="files"
              beforeUpload={() => false}
              multiple={true}
              maxCount={3}
              onChange={({ fileList }) => {
                if (fileList.length > 3) {
                  message.warning("Maximum 3 files allowed");
                  fundRequestForm.setFieldsValue({
                    documentationFiles: fileList.slice(0, 3),
                  });
                }
              }}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-gray-400" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint text-xs text-gray-500">
                Support for PDF, Word, Excel, JPG/PNG files. Max 3 files.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setFundRequestModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-none"
              icon={<DollarOutlined />}
              loading={isSubmittingRequest || isUploadingDocuments}
              disabled={isSubmittingRequest || isUploadingDocuments}
            >
              {isSubmittingRequest
                ? "Submitting Request..."
                : isUploadingDocuments
                ? "Uploading Documents..."
                : "Submit Fund Request"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Completion Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CheckCircleOutlined className="text-green-500 mr-2" />
            <span>
              {completionStep === "preview"
                ? "Project Summary"
                : "Request Project Completion"}
            </span>
          </div>
        }
        open={completionModalVisible}
        onCancel={() => setCompletionModalVisible(false)}
        footer={null}
        width={800}
      >
        {completionStep === "preview" ? (
          <div>
            {isLoadingCompletionSummary ? (
              <div className="text-center py-8">
                <Spin size="large" />
                <p className="mt-4">Loading project summary...</p>
              </div>
            ) : completionSummary ? (
              <>
                <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                  <div className="flex items-start">
                    <CheckOutlined className="text-green-500 text-lg mt-1 mr-3" />
                    <div>
                      <Text strong className="text-green-700 text-lg">
                        Project Summary
                      </Text>
                      <Text className="text-green-600 block mt-1">
                        Review the project details before submitting your
                        completion request.
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Key Statistics */}
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    Project Overview
                  </h3>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="Total Budget"
                        value={completionSummary.approvedBudget}
                        precision={0}
                        formatter={(value) => (
                          <span>₫{value.toLocaleString()}</span>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Spent Budget"
                        value={completionSummary.spentBudget}
                        precision={0}
                        formatter={(value) => (
                          <span>₫{value.toLocaleString()}</span>
                        )}
                        valueStyle={{ color: "#22c55e" }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Remaining Budget"
                        value={completionSummary.remainingBudget}
                        precision={0}
                        formatter={(value) => (
                          <span>₫{value.toLocaleString()}</span>
                        )}
                        valueStyle={{ color: "#3b82f6" }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Budget Utilization"
                        value={
                          completionSummary.approvedBudget > 0
                            ? (completionSummary.spentBudget /
                                completionSummary.approvedBudget) *
                              100
                            : 0
                        }
                        precision={1}
                        suffix="%"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Project Duration"
                        value={Math.ceil(
                          (new Date(completionSummary.endDate) -
                            new Date(completionSummary.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )}
                        suffix="days"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Phase Completion"
                        value={`${completionSummary.completedPhases}/${completionSummary.totalPhases}`}
                        valueStyle={{ color: "#22c55e" }}
                      />
                    </Col>
                  </Row>
                </div>

                {/* Phase Timeline */}
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    Phase Timeline
                  </h3>
                  <Timeline>
                    {completionSummary.phases.map((phase) => (
                      <Timeline.Item
                        key={phase.projectPhaseId}
                        color={
                          phase.status === 2
                            ? "green"
                            : phase.status === 3
                            ? "red"
                            : "blue"
                        }
                        dot={
                          phase.status === 2 ? (
                            <CheckCircleOutlined />
                          ) : (
                            <ClockCircleOutlined />
                          )
                        }
                      >
                        <div className="font-medium">{phase.title}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(phase.startDate)} -{" "}
                          {formatDate(phase.endDate)}
                        </div>
                        <div className="mt-1">
                          <Tag
                            color={
                              phase.status === 2
                                ? "success"
                                : phase.status === 3
                                ? "error"
                                : phase.status === 1
                                ? "warning"
                                : "blue"
                            }
                            className="mr-2"
                          >
                            {PHASE_STATUS[phase.status]}
                          </Tag>
                          <Tag color="green">
                            ₫{phase.spentBudget.toLocaleString()}
                          </Tag>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>

                {/* Team Members */}
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    Team Members ({completionSummary.teamMembers.length})
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <List
                      itemLayout="horizontal"
                      dataSource={completionSummary.teamMembers}
                      renderItem={(member) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={<UserOutlined />}
                                style={{
                                  backgroundColor:
                                    member.role === 0
                                      ? "#F2722B"
                                      : member.role === 2
                                      ? "#8b5cf6"
                                      : "#3b82f6",
                                }}
                              />
                            }
                            title={<span>{member.memberName}</span>}
                            description={
                              <div>
                                <div>{member.memberEmail}</div>
                                <Tag
                                  color={
                                    member.role === 0
                                      ? "orange"
                                      : member.role === 2
                                      ? "purple"
                                      : "blue"
                                  }
                                >
                                  {MEMBER_ROLE[member.role]}
                                </Tag>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>

                {/* Disbursements */}
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    Fund Disbursements ({completionSummary.disbursementCount})
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <Timeline>
                      {completionSummary.disbursements.map((disbursement) => (
                        <Timeline.Item
                          key={disbursement.fundDisbursementId}
                          color={
                            disbursement.status === 1
                              ? "green"
                              : disbursement.status === 2
                              ? "red"
                              : "blue"
                          }
                        >
                          <div className="font-medium">
                            ₫{disbursement.fundRequest.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {disbursement.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            Requested on {formatDate(disbursement.createdAt)}
                          </div>
                          <div className="mt-1">
                            <Tag
                              color={
                                disbursement.status === 1
                                  ? "success"
                                  : disbursement.status === 2
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {disbursement.statusName}
                            </Tag>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </div>

                {/* Documents - Organized by type */}
                <div className="bg-gray-50 p-5 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    Project Documents ({completionSummary.documentCount})
                  </h3>

                  <Collapse
                    defaultActiveKey={["0"]}
                    className="bg-white shadow-sm rounded-xl"
                  >
                    {/* Project Documents */}
                    <Panel
                      header={
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                              <FileTextOutlined />
                            </div>
                            <span className="font-medium">
                              Project Proposals
                            </span>
                          </div>
                          <Badge
                            count={
                              completionSummary.documents.filter(
                                (d) => d.documentType === 0
                              ).length
                            }
                            style={{ backgroundColor: "#3b82f6" }}
                          />
                        </div>
                      }
                      key="0"
                    >
                      <List
                        size="small"
                        dataSource={completionSummary.documents.filter(
                          (d) => d.documentType === 0
                        )}
                        locale={{ emptyText: "No project proposals" }}
                        renderItem={(doc) => (
                          <List.Item
                            actions={[
                              <Button
                                type="link"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  handleDownloadDocument(doc.documentUrl)
                                }
                              >
                                View
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                                  <FileTextOutlined />
                                </div>
                              }
                              title={
                                <Tooltip title={doc.fileName}>
                                  <div className="truncate max-w-xs">
                                    {doc.fileName}
                                  </div>
                                </Tooltip>
                              }
                              description={
                                <div className="text-xs text-gray-500">
                                  Uploaded: {formatDate(doc.uploadAt)}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>

                    {/* Disbursement Documents */}
                    <Panel
                      header={
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3">
                              <DollarOutlined />
                            </div>
                            <span className="font-medium">
                              Disbursement Documents
                            </span>
                          </div>
                          <Badge
                            count={
                              completionSummary.documents.filter(
                                (d) => d.documentType === 1
                              ).length
                            }
                            style={{ backgroundColor: "#22c55e" }}
                          />
                        </div>
                      }
                      key="1"
                    >
                      <List
                        size="small"
                        dataSource={completionSummary.documents.filter(
                          (d) => d.documentType === 1
                        )}
                        locale={{ emptyText: "No disbursement documents" }}
                        renderItem={(doc) => (
                          <List.Item
                            actions={[
                              <Button
                                type="link"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  handleDownloadDocument(doc.documentUrl)
                                }
                              >
                                View
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600">
                                  <DollarOutlined />
                                </div>
                              }
                              title={
                                <Tooltip title={doc.fileName}>
                                  <div className="truncate max-w-xs">
                                    {doc.fileName}
                                  </div>
                                </Tooltip>
                              }
                              description={
                                <div className="text-xs text-gray-500">
                                  Uploaded: {formatDate(doc.uploadAt)}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>

                    {/* Council Decision Documents */}
                    <Panel
                      header={
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                              <BankOutlined />
                            </div>
                            <span className="font-medium">
                              Council Decisions
                            </span>
                          </div>
                          <Badge
                            count={
                              completionSummary.documents.filter(
                                (d) => d.documentType === 2
                              ).length
                            }
                            style={{ backgroundColor: "#8b5cf6" }}
                          />
                        </div>
                      }
                      key="2"
                    >
                      <List
                        size="small"
                        dataSource={completionSummary.documents.filter(
                          (d) => d.documentType === 2
                        )}
                        locale={{ emptyText: "No council decision documents" }}
                        renderItem={(doc) => (
                          <List.Item
                            actions={[
                              <Button
                                type="link"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  handleDownloadDocument(doc.documentUrl)
                                }
                              >
                                View
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600">
                                  <BankOutlined />
                                </div>
                              }
                              title={
                                <Tooltip title={doc.fileName}>
                                  <div className="truncate max-w-xs">
                                    {doc.fileName}
                                  </div>
                                </Tooltip>
                              }
                              description={
                                <div className="text-xs text-gray-500">
                                  Uploaded: {formatDate(doc.uploadAt)}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>

                    {/* Academic Publication Documents */}
                    <Panel
                      header={
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mr-3">
                              <FileOutlined />
                            </div>
                            <span className="font-medium">
                              Academic Publications
                            </span>
                          </div>
                          <Badge
                            count={
                              completionSummary.documents.filter(
                                (d) =>
                                  d.documentType === 3 || d.documentType === 4
                              ).length
                            }
                            style={{ backgroundColor: "#06b6d4" }}
                          />
                        </div>
                      }
                      key="academic"
                    >
                      <List
                        size="small"
                        dataSource={completionSummary.documents.filter(
                          (d) => d.documentType === 3 || d.documentType === 4
                        )}
                        locale={{ emptyText: "No academic publications" }}
                        renderItem={(doc) => {
                          const {
                            icon: DocIcon,
                            bgColor,
                            textColor,
                          } = getDocumentTypeVisuals(doc.documentType);
                          return (
                            <List.Item
                              actions={[
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<DownloadOutlined />}
                                  onClick={() =>
                                    handleDownloadDocument(doc.documentUrl)
                                  }
                                >
                                  View
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${bgColor} ${textColor}`}
                                  >
                                    {DocIcon}
                                  </div>
                                }
                                title={
                                  <Tooltip title={doc.fileName}>
                                    <div className="truncate max-w-xs">
                                      {doc.fileName}
                                    </div>
                                  </Tooltip>
                                }
                                description={
                                  <div>
                                    <div className="text-xs text-gray-500">
                                      Type: {DOCUMENT_TYPE[doc.documentType]}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Uploaded: {formatDate(doc.uploadAt)}
                                    </div>
                                  </div>
                                }
                              />
                            </List.Item>
                          );
                        }}
                      />
                    </Panel>
                  </Collapse>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button onClick={() => setCompletionModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => setCompletionStep("form")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
                  >
                    Continue to Form
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Empty description="Could not load project summary" />
                <Button
                  onClick={() => setCompletionModalVisible(false)}
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Form
            form={completionForm}
            layout="vertical"
            onFinish={handleCompletionSubmit}
          >
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-start">
                <InfoCircleOutlined className="text-blue-500 text-lg mt-1 mr-3" />
                <div>
                  <Text strong className="text-blue-700">
                    Please provide final project details
                  </Text>
                  <Text className="text-blue-600 block mt-1">
                    This information will be reviewed by the council before
                    approving project completion.
                  </Text>
                </div>
              </div>
            </div>

            <Form.Item
              name="projectOutcomes"
              label="Project Outcomes"
              rules={[
                {
                  required: true,
                  message: "Please describe the project outcomes",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Summarize what the project has achieved compared to its original objectives"
              />
            </Form.Item>

            <Form.Item
              name="budgetVarianceExplanation"
              label="Budget Explanation"
              rules={[
                {
                  required: true,
                  message: "Please provide budget information",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Explain any budget variances or how the budget was utilized"
              />
            </Form.Item>

            {/* Budget reconciliation section */}
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <div className="flex items-start">
                <InfoCircleOutlined className="text-yellow-600 text-lg mt-1 mr-3" />
                <div>
                  <Text strong className="text-yellow-700">
                    Budget Reconciliation Required
                  </Text>
                  <Text className="text-yellow-600 block mt-1">
                    If your project has remaining unspent budget (₫
                    {completionSummary?.remainingBudget?.toLocaleString() ||
                      "0"}
                    ), you must confirm that you have returned these funds to
                    the finance department before requesting project completion.
                  </Text>
                  <Text className="text-red-500 font-medium mt-2">
                    * You must check the confirmation box below to submit your
                    completion request
                  </Text>
                </div>
              </div>
            </div>

            <Form.Item
              name="budgetReconciled"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Budget reconciliation confirmation is required to complete this project"
                          )
                        ),
                },
              ]}
              className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
            >
              <Checkbox>
                <span className="font-medium">
                  I confirm that all project funds have been accounted for and
                  any remaining budget has been returned to the finance
                  department
                </span>
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="completionDocuments"
              label="Completion Documents"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[
                {
                  required: true,
                  message: "Please upload at least one completion document",
                },
              ]}
            >
              <Upload.Dragger
                name="documentFiles"
                multiple
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
                <p className="ant-upload-hint">
                  Attach final reports, publications, financial records, or
                  other relevant completion documents
                </p>
              </Upload.Dragger>
            </Form.Item>

            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => setCompletionStep("preview")}>
                Back to Summary
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
                icon={<CheckCircleOutlined />}
                loading={isSubmittingCompletion || isUploadingCompletionDocs}
                disabled={isSubmittingCompletion || isUploadingCompletionDocs}
              >
                {isSubmittingCompletion
                  ? "Submitting Request..."
                  : isUploadingCompletionDocs
                  ? "Uploading Documents..."
                  : "Submit Completion Request"}
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* Create Paper Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FileTextOutlined className="text-blue-500 mr-2" />
            <span>Create Research Paper</span>
          </div>
        }
        open={createPaperModalVisible}
        onCancel={() => setCreatePaperModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-blue-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-blue-700">
                Create Research Paper from Project
              </Text>
              <Text className="text-blue-600 block">
                Select the type of paper you want to create from this research
                project. You will be able to upload your paper and manage the
                submission process.
              </Text>
            </div>
          </div>
        </div>

        <Tabs
          activeKey={paperType}
          onChange={setPaperType}
          className="paper-type-tabs"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <Tabs.TabPane
            tab={
              <span>
                <GlobalOutlined /> Conference Paper
              </span>
            }
            key="conference"
          >
            <Form
              form={createConferenceForm}
              layout="vertical"
              onFinish={handleCreatePaperSubmit}
            >
              <Form.Item
                name="conferenceName"
                label="Conference Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the conference name",
                  },
                ]}
              >
                <Input placeholder="Enter the name of the conference" />
              </Form.Item>

              <Form.Item
                name="conferenceRanking"
                label="Conference Ranking"
                rules={[
                  {
                    required: true,
                    message: "Please select the conference ranking",
                  },
                ]}
              >
                <Select placeholder="Select conference ranking">
                  <Select.Option value="0">Not Ranked</Select.Option>
                  <Select.Option value="1">C</Select.Option>
                  <Select.Option value="2">B</Select.Option>
                  <Select.Option value="3">A</Select.Option>
                  <Select.Option value="4">A*</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="presentationType"
                label="Presentation Type"
                rules={[
                  {
                    required: true,
                    message: "Please select the presentation type",
                  },
                ]}
              >
                <Select placeholder="Select presentation type">
                  <Select.Option value="0">Oral Presentation</Select.Option>
                  <Select.Option value="1">Poster Presentation</Select.Option>
                  <Select.Option value="2">Workshop Presentation</Select.Option>
                  <Select.Option value="3">Panel Presentation</Select.Option>
                  <Select.Option value="4">Virtual Presentation</Select.Option>
                  <Select.Option value="5">Demonstration</Select.Option>
                </Select>
              </Form.Item>

              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={() => setCreatePaperModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreatingConference}
                  disabled={isCreatingConference}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
                >
                  {isCreatingConference
                    ? "Creating..."
                    : "Create Conference Paper"}
                </Button>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <BookOutlined /> Journal Paper
              </span>
            }
            key="journal"
          >
            <Form
              form={createJournalForm}
              layout="vertical"
              onFinish={handleCreatePaperSubmit}
            >
              <Form.Item
                name="journalName"
                label="Journal Name"
                rules={[
                  { required: true, message: "Please enter the journal name" },
                ]}
              >
                <Input placeholder="Enter the name of the journal" />
              </Form.Item>

              <Form.Item
                name="publisherName"
                label="Publisher Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the publisher name",
                  },
                ]}
              >
                <Input placeholder="Enter the name of the publisher" />
              </Form.Item>

              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={() => setCreatePaperModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreatingJournal}
                  disabled={isCreatingJournal}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
                >
                  {isCreatingJournal ? "Creating..." : "Create Journal Paper"}
                </Button>
              </div>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <UploadOutlined className="text-blue-500 mr-2" />
            <span>Upload Project Document</span>
          </div>
        }
        open={isUploadDocumentModalVisible}
        onCancel={() => setIsUploadDocumentModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-blue-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-blue-700">
                Upload Project Document
              </Text>
              <Text className="text-blue-600 block">
                Please select the type of document you want to upload and attach
                the files.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={uploadDocumentForm}
          layout="vertical"
          onFinish={handleUploadDocumentSubmit}
          className="mt-4"
        >
          <Form.Item
            name="documentFiles"
            label="Documents"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e.slice(0, 3);
              }
              return e && e.fileList?.slice(0, 3);
            }}
            rules={[
              {
                validator: (_, fileList) => {
                  if (fileList && fileList.length > 3) {
                    return Promise.reject("Maximum 3 files allowed");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            help="Upload up to 3 supporting documents (invoices, receipts, quotes, etc.)"
          >
            <Upload.Dragger
              name="files"
              beforeUpload={() => false}
              multiple={true}
              maxCount={3}
              onChange={({ fileList }) => {
                if (fileList.length > 3) {
                  message.warning("Maximum 3 files allowed");
                  uploadDocumentForm.setFieldsValue({
                    documentFiles: fileList.slice(0, 3),
                  });
                }
              }}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-gray-400" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint text-xs text-gray-500">
                Support for PDF, Word, Excel, JPG/PNG files. Max 3 files.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsUploadDocumentModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-none"
              icon={<UploadOutlined />}
              loading={isUploadingProjectDocument}
              disabled={isUploadingProjectDocument}
            >
              {isUploadingProjectDocument
                ? "Uploading..."
                : "Upload Project Document"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
