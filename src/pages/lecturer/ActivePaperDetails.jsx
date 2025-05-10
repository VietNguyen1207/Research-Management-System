import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Tag,
  Button,
  Steps,
  Form,
  Input,
  DatePicker,
  Select,
  Typography,
  Divider,
  Space,
  Modal,
  message,
  Timeline,
  Row,
  Col,
  Descriptions,
  InputNumber,
  Upload,
  Progress,
  Spin,
  Empty,
  Collapse,
  List,
  Avatar,
  Tooltip,
  Statistic,
  Skeleton,
  Table,
  Badge,
} from "antd";
import {
  BookOutlined,
  GlobalOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ProjectOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  FileOutlined,
  InboxOutlined,
  HistoryOutlined,
  BankOutlined,
  CheckOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  useGetConferenceDetailsQuery,
  useUpdateApprovedConferenceDetailsMutation,
  useUploadConferenceDocumentsMutation,
  useRequestConferenceExpenseMutation,
  useUploadConferenceExpenseDocumentsMutation,
  useGetConferenceExpensesQuery,
  useRequestConferenceFundingMutation,
  useUploadConferenceFundingDocumentsMutation,
  useGetConferenceFundingQuery,
} from "../../features/project/conference/conferenceApiSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

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

// Add this helper function to get document icon and color based on type
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
    case 8: // Conference Expense
      return {
        icon: <DollarOutlined />,
        color: "orange",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      };
    case 9: // Conference Expense Decision
      return {
        icon: <CheckCircleOutlined />,
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
      };
    case 10: // Conference Funding
      return {
        icon: <DollarOutlined />,
        color: "purple",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
      };
    case 11: // Journal Funding
      return {
        icon: <DollarOutlined />,
        color: "blue",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
      };
    case 12: // Funding Confirmation
      return {
        icon: <CheckCircleOutlined />,
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
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

const ActivePaperDetails = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const { conferenceId } = useParams();
  const navigate = useNavigate();
  const [isConferenceModalVisible, setIsConferenceModalVisible] =
    useState(false);
  const [isPublisherModalVisible, setIsPublisherModalVisible] = useState(false);
  const [isTravelExpenseModalVisible, setIsTravelExpenseModalVisible] =
    useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isFundingModalVisible, setIsFundingModalVisible] = useState(false);
  const [isFundingHistoryModalVisible, setIsFundingHistoryModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [fundingForm] = Form.useForm();
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [updateApprovedDetails, { isLoading: isUpdatingDetails }] =
    useUpdateApprovedConferenceDetailsMutation();
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadDocuments, { isLoading: isUploading }] =
    useUploadConferenceDocumentsMutation();
  const [requestExpense, { isLoading: isRequestingExpense }] =
    useRequestConferenceExpenseMutation();
  const [isExpenseHistoryModalVisible, setIsExpenseHistoryModalVisible] =
    useState(false);
  const [expenseFileList, setExpenseFileList] = useState([]);
  const [uploadExpenseDocuments, { isLoading: isUploadingExpenseDocuments }] =
    useUploadConferenceExpenseDocumentsMutation();
  const [fundingFileList, setFundingFileList] = useState([]);
  const [requestConferenceFunding, { isLoading: isRequestingFunding }] =
    useRequestConferenceFundingMutation();
  const [uploadFundingDocuments, { isLoading: isUploadingFundingDocuments }] =
    useUploadConferenceFundingDocumentsMutation();

  const {
    data: expensesResponse,
    isLoading: isLoadingExpenses,
    refetch: fetchExpenses,
  } = useGetConferenceExpensesQuery(conferenceId, {
    // Remove the skip condition so we always have the data
    // skip: !isExpenseHistoryModalVisible,
  });

  const {
    data: fundingResponse,
    isLoading: isLoadingFunding,
    refetch: fetchFunding,
  } = useGetConferenceFundingQuery(conferenceId, {
    // Always fetch funding data
  });

  // Add a useEffect to fetch expenses when the component loads
  useEffect(() => {
    if (conferenceId) {
      fetchExpenses();
    }
  }, [conferenceId, fetchExpenses]);

  // Add a useEffect to fetch funding when the component loads
  useEffect(() => {
    if (conferenceId) {
      fetchFunding();
    }
  }, [conferenceId, fetchFunding]);

  // Add a function to check if there's already an approved expense
  const hasApprovedExpense = useMemo(() => {
    if (!expensesResponse?.data) return false;
    return expensesResponse.data.some((expense) => expense.expenseStatus === 1);
  }, [expensesResponse]);

  // Add a function to check if there's already an approved funding request
  const hasApprovedFunding = useMemo(() => {
    if (!fundingResponse?.data) return false;
    return fundingResponse.data.some((funding) => funding.status === 1);
  }, [fundingResponse]);

  // Define styles
  const styles = `
    .text-gradient {
      background: linear-gradient(to right, #0d9488, #0f766e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .ant-descriptions-item-label {
      font-weight: 500;
    }

    .ant-timeline-item-head {
      background-color: #fff;
    }

    .timeline-clock-icon {
      font-size: 16px;
    }

    .ant-card {
      transition: all 0.3s ease;
    }

    .ant-tag {
      transition: all 0.3s ease;
    }

    .ant-btn {
      transition: all 0.3s ease;
    }

    .ant-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .ant-descriptions-bordered .ant-descriptions-item-label {
      background-color: rgba(13, 148, 136, 0.05);
    }

    .ant-descriptions-bordered .ant-descriptions-view {
      border-radius: 8px;
      overflow: hidden;
      border-color: rgba(13, 148, 136, 0.2);
    }
    
    /* Confirmation Modal Styling */
    .confirmation-modal .ant-modal-content {
      border-radius: 12px;
      overflow: hidden;
    }
    
    .confirmation-modal .ant-modal-body {
      padding: 24px;
    }
    
    .confirmation-modal .ant-modal-confirm-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .confirmation-modal .ant-modal-confirm-content {
      margin-top: 16px;
      margin-bottom: 24px;
      font-size: 15px;
      line-height: 1.6;
    }
    
    .confirmation-modal .ant-modal-confirm-btns {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .confirmation-modal .ant-btn {
      border-radius: 6px;
      font-weight: 500;
      padding: 6px 16px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  // Fetch conference details
  const {
    data: conferenceResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetConferenceDetailsQuery(conferenceId);

  const conferenceDetails = conferenceResponse?.data;

  // Add useEffect to refetch conference details when component mounts
  useEffect(() => {
    // Refetch conference details when component mounts
    if (conferenceId) {
      refetch();
    }
  }, [conferenceId, refetch]);

  // Add the styles useEffect BEFORE any conditional returns
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Mock data - Replace with API call
  useEffect(() => {
    // Simulating API fetch
    if (id === "1") {
      setPaper({
        id: 1,
        type: "Conference",
        title: "Machine Learning Applications in Education",
        abstract:
          "This paper explores innovative applications of machine learning...",
        status: "accepted",
        publisher: "IEEE Conference on Educational Technology",
        milestones: [
          {
            id: 1,
            title: "Initial Draft",
            deadline: "2024-03-20",
            status: "completed",
            notes: "Completed on time",
          },
          {
            id: 2,
            title: "Internal Review",
            deadline: "2024-04-15",
            status: "in_progress",
            notes: "Under review by department",
          },
        ],
        conferenceDetails: {
          location: "Singapore",
          date: "2024-06-15",
          presentationType: "oral",
          travelExpense: {
            status: "pending",
            amount: 15000000,
            details: "Flight and accommodation for 3 days",
          },
        },
        publisherHistory: [
          {
            name: "IEEE Transactions",
            submissionDate: "2024-02-15",
            status: "approved",
            doi: "10.1109/TLT.2024.123456",
          },
        ],
      });
    } else {
      setPaper({
        id: 2,
        type: "Journal",
        title: "Deep Learning Approaches in Healthcare Data Analytics",
        abstract:
          "This research presents novel deep learning architectures for analyzing healthcare data, focusing on early disease detection and patient outcome prediction. The study demonstrates significant improvements in accuracy and efficiency compared to traditional methods.",
        status: "in_review",
        publisher: "Medical Artificial Intelligence Journal",
        milestones: [
          {
            id: 1,
            title: "Literature Review",
            deadline: "2024-01-15",
            status: "completed",
            notes: "Comprehensive review of existing methodologies completed",
          },
          {
            id: 2,
            title: "Methodology Development",
            deadline: "2024-02-28",
            status: "completed",
            notes: "Novel deep learning architecture designed and implemented",
          },
          {
            id: 3,
            title: "Data Analysis & Results",
            deadline: "2024-03-30",
            status: "completed",
            notes: "Experimental results analyzed and documented",
          },
          {
            id: 4,
            title: "Paper Draft",
            deadline: "2024-04-15",
            status: "in_progress",
            notes: "First draft under internal review",
          },
        ],
        publisherHistory: [
          {
            name: "Nature Digital Medicine",
            submissionDate: "2024-01-10",
            status: "rejected",
            notes:
              "Scope mismatch, suggested to submit to a more specialized journal",
          },
          {
            name: "Medical Artificial Intelligence Journal",
            submissionDate: "2024-03-01",
            status: "under_review",
            notes: "First round of peer review in progress",
            expectedResponseDate: "2024-05-01",
          },
        ],
        authors: [
          {
            name: "Dr. Sarah Johnson",
            role: "Main Author",
            email: "sarah.johnson@university.edu",
            department: "Computer Science",
          },
          {
            name: "Dr. Michael Chen",
            role: "Co-Author",
            email: "michael.chen@university.edu",
            department: "Medical Informatics",
          },
          {
            name: "Prof. Lisa Wong",
            role: "Co-Author",
            email: "lisa.wong@university.edu",
            department: "Healthcare Analytics",
          },
        ],
        department: {
          id: 1,
          name: "Computer Science",
        },
        category: {
          id: 1,
          name: "AI & Machine Learning",
        },
        keywords: [
          "Deep Learning",
          "Healthcare Analytics",
          "Disease Detection",
          "Patient Outcome Prediction",
          "Medical AI",
        ],
        progress: 65,
        submissionHistory: [
          {
            version: "1.0",
            date: "2024-01-10",
            publisher: "Nature Digital Medicine",
            status: "rejected",
            feedback: "Scope mismatch, recommended for specialized journal",
          },
          {
            version: "2.0",
            date: "2024-03-01",
            publisher: "Medical Artificial Intelligence Journal",
            status: "under_review",
            currentStage: "Peer Review",
          },
        ],
        expectedCompletionDate: "2024-06-30",
        fundingSource: "University Research Grant",
        collaborations: [
          {
            institution: "City General Hospital",
            role: "Data Provider",
          },
          {
            institution: "Healthcare Analytics Institute",
            role: "Research Partner",
          },
        ],
      });
    }
  }, [id]);

  const handleMilestoneEdit = (milestone) => {
    setEditingMilestone(milestone);
    form.setFieldsValue({
      title: milestone.title,
      deadline: dayjs(milestone.deadline),
      status: milestone.status,
      notes: milestone.notes,
    });
  };

  const handleMilestoneSave = async (values) => {
    try {
      // API call to update milestone
      message.success("Milestone updated successfully");
      setEditingMilestone(null);
    } catch (error) {
      message.error("Failed to update milestone");
    }
  };

  const handleConferenceUpdate = async (values) => {
    try {
      // API call to update conference details
      message.success("Conference details updated successfully");
      setIsConferenceModalVisible(false);
    } catch (error) {
      message.error("Failed to update conference details");
    }
  };

  const handlePublisherUpdate = async (values) => {
    try {
      // API call to update publisher status
      message.success("Publisher status updated successfully");
      setIsPublisherModalVisible(false);
    } catch (error) {
      message.error("Failed to update publisher status");
    }
  };

  const handleTravelExpenseSubmit = async (values) => {
    try {
      // API call to submit travel expense
      message.success("Travel expense request submitted successfully");
      setIsTravelExpenseModalVisible(false);
    } catch (error) {
      message.error("Failed to submit travel expense request");
    }
  };

  const handleExpenseSubmit = async () => {
    try {
      // First validate all form fields
      const values = await expenseForm.validateFields();

      // Check if required documents are uploaded
      if (expenseFileList.length === 0) {
        message.error("Please upload at least one supporting document");
        return;
      }

      // Step 1: Submit the expense request
      const expenseData = {
        conferenceId: parseInt(conferenceId),
        accommodation: values.accommodation,
        accommodationExpense: values.accommodationExpense,
        travel: values.travel,
        travelExpense: values.travelExpense,
      };

      // Submit the request and get the requestId from the response
      const expenseResponse = await requestExpense({
        conferenceId,
        expenseData,
      }).unwrap();

      const requestId = expenseResponse?.data?.requestId;

      if (!requestId) {
        message.error("Failed to get request ID. Please try again.");
        return;
      }

      // Step 2: Upload documents for the expense request using the obtained requestId
      const formData = new FormData();
      expenseFileList.forEach((file) => {
        formData.append("documentFiles", file.originFileObj);
      });

      await uploadExpenseDocuments({
        conferenceId,
        requestId,
        formData,
      }).unwrap();

      message.success("Conference expense request submitted successfully");
      setIsExpenseModalVisible(false);
      expenseForm.resetFields();
      setExpenseFileList([]);

      fetchExpenses(); // Refresh expense history
      refetch(); // Refresh conference details
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to submit expense request:", error);
        message.error(
          error.data?.message ||
            "Failed to submit expense request. Please try again."
        );
      }
    }
  };

  const handleFundingSubmit = async () => {
    try {
      // First validate all form fields
      const values = await fundingForm.validateFields();

      // Check if required documents are uploaded
      if (fundingFileList.length === 0) {
        message.error("Please upload at least one supporting document");
        return;
      }

      // Check if dates or location are being set for the first time
      const isSettingDateForFirstTime =
        (!isValidDate(conferenceDetails.presentationDate) &&
          values.presentationDate) ||
        (!isValidDate(conferenceDetails.acceptanceDate) &&
          values.acceptanceDate);

      const isSettingLocationForFirstTime =
        !isLocationSet() &&
        values.location &&
        values.location.trim().length > 0;

      // Prepare funding data - respect already set funding amount
      const fundingData = {
        conferenceId: parseInt(conferenceId),
        location:
          !isLocationSet() && values.location
            ? values.location
            : conferenceDetails.location,
        presentationDate:
          !isValidDate(conferenceDetails.presentationDate) &&
          values.presentationDate
            ? values.presentationDate.toISOString()
            : conferenceDetails.presentationDate,
        acceptanceDate:
          !isValidDate(conferenceDetails.acceptanceDate) &&
          values.acceptanceDate
            ? values.acceptanceDate.toISOString()
            : conferenceDetails.acceptanceDate,
        conferenceFunding:
          conferenceDetails.conferenceFunding > 0
            ? conferenceDetails.conferenceFunding
            : values.fundingAmount,
      };

      // If setting dates or location for the first time, show confirmation
      if (isSettingDateForFirstTime || isSettingLocationForFirstTime) {
        Modal.confirm({
          title: "Details cannot be modified later",
          icon: (
            <InfoCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />
          ),
          content: (
            <div className="py-2">
              <p className="mb-3">
                Please ensure that the Location, Acceptance Date, and
                Presentation Date you've entered are accurate.
              </p>
              <p className="mb-3">
                <strong className="text-amber-600">Important:</strong> Once
                saved, these details{" "}
                <strong className="text-amber-600">cannot be modified</strong>{" "}
                later. Only the funding amount can be changed.
              </p>
              <p>Do you want to proceed with the funding request?</p>
            </div>
          ),
          okText: "Yes, I confirm",
          okButtonProps: {
            className:
              "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none",
            style: { minWidth: "130px", height: "38px" },
          },
          cancelText: "No, I need to review",
          cancelButtonProps: {
            style: { minWidth: "130px", height: "38px" },
          },
          width: 550,
          centered: true,
          className: "confirmation-modal",
          maskClosable: false,
          bodyStyle: { paddingTop: 20, paddingBottom: 20 },
          onOk: async () => {
            // Submit the request and get the requestId from the response
            const fundingResponse = await requestConferenceFunding({
              conferenceId,
              fundingData,
            }).unwrap();

            const requestId = fundingResponse?.data?.requestId;

            if (!requestId) {
              message.error("Failed to get request ID. Please try again.");
              return;
            }

            // Step 2: Upload documents for the funding request using the obtained requestId
            const formData = new FormData();
            fundingFileList.forEach((file) => {
              formData.append("documentFiles", file.originFileObj);
            });

            await uploadFundingDocuments({
              conferenceId,
              requestId,
              formData,
            }).unwrap();

            message.success(
              "Conference funding request submitted successfully"
            );
            setIsFundingModalVisible(false);
            fundingForm.resetFields();
            setFundingFileList([]);

            // Refresh conference details
            refetch();
          },
        });
      } else {
        // If not setting dates or location for the first time, proceed without confirmation
        // Submit the request and get the requestId from the response
        const fundingResponse = await requestConferenceFunding({
          conferenceId,
          fundingData,
        }).unwrap();

        const requestId = fundingResponse?.data?.requestId;

        if (!requestId) {
          message.error("Failed to get request ID. Please try again.");
          return;
        }

        // Step 2: Upload documents for the funding request using the obtained requestId
        const formData = new FormData();
        fundingFileList.forEach((file) => {
          formData.append("documentFiles", file.originFileObj);
        });

        await uploadFundingDocuments({
          conferenceId,
          requestId,
          formData,
        }).unwrap();

        message.success("Conference funding request submitted successfully");
        setIsFundingModalVisible(false);
        fundingForm.resetFields();
        setFundingFileList([]);

        // Refresh conference details
        refetch();
      }
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to submit funding request:", error);
        message.error(
          error.data?.message ||
            "Failed to submit funding request. Please try again."
        );
      }
    }
  };

  const formatCurrency = (value) => {
    return value ? `₫${value.toLocaleString()}` : "₫0";
  };

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).getFullYear() <= 1)
      return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: // Pending
        return "warning";
      case 1: // Approved
        return "success";
      case 2: // Rejected
        return "error";
      default:
        return "default";
    }
  };

  const getRankingColor = (ranking) => {
    switch (ranking) {
      case 4: // A*
        return "#f50";
      case 3: // A
        return "#2db7f5";
      case 2: // B
        return "#87d068";
      case 1: // C
        return "#108ee9";
      default:
        return "#d9d9d9";
    }
  };

  const getPresentationTypeLabel = (typeCode) => {
    switch (typeCode) {
      case 0:
        return "Oral Presentation";
      case 1:
        return "Poster Presentation";
      case 2:
        return "Workshop Presentation";
      case 3:
        return "Panel Presentation";
      case 4:
        return "Virtual Presentation";
      case 5:
        return "Demonstration";
      default:
        return "Unknown";
    }
  };

  const handleOpenDetailsModal = () => {
    // Check if funding is already approved
    if (hasApprovedFunding) {
      message.error(
        "Cannot modify conference details after funding has been approved"
      );
      return;
    }

    // Set initial form values
    detailsForm.setFieldsValue({
      location: conferenceDetails.location || "",
      presentationDate: conferenceDetails.presentationDate
        ? dayjs(conferenceDetails.presentationDate)
        : null,
      acceptanceDate: conferenceDetails.acceptanceDate
        ? dayjs(conferenceDetails.acceptanceDate)
        : null,
      conferenceFunding: conferenceDetails.conferenceFunding || 0,
    });
    setIsDetailsModalVisible(true);
  };

  const handleDetailsSubmit = async () => {
    try {
      // Double-check if funding is already approved (in case state changed while modal was open)
      if (hasApprovedFunding) {
        message.error(
          "Cannot modify conference details after funding has been approved"
        );
        setIsDetailsModalVisible(false);
        return;
      }

      const values = await detailsForm.validateFields();

      // Check if dates or location are being set for the first time
      const isSettingDateForFirstTime =
        (!isValidDate(conferenceDetails.presentationDate) &&
          values.presentationDate) ||
        (!isValidDate(conferenceDetails.acceptanceDate) &&
          values.acceptanceDate);

      const isSettingLocationForFirstTime =
        !isLocationSet() &&
        values.location &&
        values.location.trim().length > 0;

      // If setting dates or location for the first time, show confirmation
      if (isSettingDateForFirstTime || isSettingLocationForFirstTime) {
        Modal.confirm({
          title: "Details cannot be modified later",
          icon: (
            <InfoCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />
          ),
          content: (
            <div className="py-2">
              <p className="mb-3">
                Please ensure that the Location, Acceptance Date, and
                Presentation Date you've entered are accurate.
              </p>
              <p className="mb-3">
                <strong className="text-amber-600">Important:</strong> Once
                saved, these details{" "}
                <strong className="text-amber-600">cannot be modified</strong>{" "}
                later. Only the funding amount can be changed.
              </p>
              <p>Do you want to proceed?</p>
            </div>
          ),
          okText: "Yes, I confirm",
          okButtonProps: {
            className:
              "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none",
            style: { minWidth: "130px", height: "38px" },
          },
          cancelText: "No, I need to review",
          cancelButtonProps: {
            style: { minWidth: "130px", height: "38px" },
          },
          width: 550,
          centered: true,
          className: "confirmation-modal",
          maskClosable: false,
          bodyStyle: { paddingTop: 20, paddingBottom: 20 },
          onOk: async () => {
            // Proceed with the update
            const formattedValues = {
              location:
                !isLocationSet() && values.location
                  ? values.location
                  : conferenceDetails.location,
              presentationDate:
                !isValidDate(conferenceDetails.presentationDate) &&
                values.presentationDate
                  ? values.presentationDate.toISOString()
                  : conferenceDetails.presentationDate,
              acceptanceDate:
                !isValidDate(conferenceDetails.acceptanceDate) &&
                values.acceptanceDate
                  ? values.acceptanceDate.toISOString()
                  : conferenceDetails.acceptanceDate,
              conferenceFunding: values.conferenceFunding,
            };

            await updateApprovedDetails({
              conferenceId,
              detailsData: formattedValues,
            }).unwrap();

            message.success("Conference details updated successfully");
            setIsDetailsModalVisible(false);
          },
        });
      } else {
        // If not setting dates or location for the first time, proceed without confirmation
        const formattedValues = {
          location:
            !isLocationSet() && values.location
              ? values.location
              : conferenceDetails.location,
          presentationDate:
            !isValidDate(conferenceDetails.presentationDate) &&
            values.presentationDate
              ? values.presentationDate.toISOString()
              : conferenceDetails.presentationDate,
          acceptanceDate:
            !isValidDate(conferenceDetails.acceptanceDate) &&
            values.acceptanceDate
              ? values.acceptanceDate.toISOString()
              : conferenceDetails.acceptanceDate,
          conferenceFunding: values.conferenceFunding,
        };

        await updateApprovedDetails({
          conferenceId,
          detailsData: formattedValues,
        }).unwrap();

        message.success("Conference details updated successfully");
        setIsDetailsModalVisible(false);
      }
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to update conference details:", error);
        message.error(
          error.data?.message ||
            "Failed to update conference details. Please try again."
        );
      }
    }
  };

  const handleDocumentUpload = async () => {
    try {
      if (fileList.length === 0) {
        message.error("Please select at least one file to upload");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("documentFiles", file.originFileObj);
      });

      await uploadDocuments({
        conferenceId,
        formData,
      }).unwrap();

      message.success("Documents uploaded successfully");
      setIsUploadModalVisible(false);
      setFileList([]);
    } catch (error) {
      console.error("Failed to upload documents:", error);
      message.error(error.data?.message || "Failed to upload documents");
    }
  };

  const handleViewExpenseHistory = () => {
    setIsExpenseHistoryModalVisible(true);
  };

  const handleViewFundingHistory = () => {
    setIsFundingHistoryModalVisible(true);
  };

  // Add these helper functions near the existing formatDate function
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getFullYear() > 1; // Check if it's a valid date (year > 1)
  };

  const areDatesAlreadySet = () => {
    return (
      isValidDate(conferenceDetails.acceptanceDate) &&
      isValidDate(conferenceDetails.presentationDate) &&
      conferenceDetails.conferenceFunding > 0
    );
  };

  // Add a helper function to check if location is already set
  const isLocationSet = () => {
    return (
      conferenceDetails.location && conferenceDetails.location.trim().length > 0
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Back button skeleton */}
          <div className="mb-6">
            <Skeleton.Button active style={{ width: 120, height: 35 }} />
          </div>

          {/* Header Card Skeleton */}
          <div className="shadow-lg rounded-2xl border-0 overflow-hidden mb-8 bg-white">
            <div className="relative">
              {/* Gradient background */}
              <div className="w-full h-32 bg-gradient-to-r from-teal-600 to-teal-700 opacity-90"></div>

              <div className="relative px-6 pb-6">
                {/* Top section with header content */}
                <div className="pt-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <Skeleton.Avatar
                      active
                      size={80}
                      className="border-4 border-white"
                    />
                    <div className="ml-4 mt-4">
                      <Skeleton.Input
                        active
                        style={{ width: 240, height: 28 }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <Skeleton.Button
                      active
                      style={{ width: 100, height: 30 }}
                    />
                    <Skeleton.Button
                      active
                      style={{ width: 120, height: 30 }}
                    />
                  </div>
                </div>

                {/* Bottom section */}
                <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner">
                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Skeleton.Button
                        active
                        style={{ width: 120, height: 35 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: 140, height: 35 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: 130, height: 35 }}
                      />
                    </div>
                    <Skeleton.Input active style={{ width: 100, height: 50 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Conference Details - now wider */}
            <div className="lg:col-span-3">
              {/* Conference Information Card Skeleton */}
              <div className="shadow-md rounded-xl border-0 mb-8 bg-white p-6">
                <div className="flex items-center mb-4">
                  <Skeleton.Input active style={{ width: 200, height: 24 }} />
                </div>

                <Skeleton active paragraph={{ rows: 8 }} title={false} />
              </div>

              {/* Documents Section Skeleton */}
              <div className="shadow-md rounded-xl border-0 mb-8 bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <Skeleton.Input active style={{ width: 180, height: 24 }} />
                  <Skeleton.Button active style={{ width: 130, height: 35 }} />
                </div>

                {/* Document list skeleton */}
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center py-4 border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton.Avatar active shape="square" />
                      <div>
                        <Skeleton.Input
                          active
                          style={{ width: 200, height: 16 }}
                        />
                        <Skeleton.Input
                          active
                          style={{ width: 150, height: 14, marginTop: 8 }}
                        />
                      </div>
                    </div>
                    <Skeleton.Button active style={{ width: 90, height: 30 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Project Info and Status */}
            <div className="lg:col-span-1">
              {/* Related Project Card Skeleton */}
              <div className="shadow-md rounded-xl border-0 mb-8 bg-white p-6">
                <Skeleton.Input
                  active
                  style={{ width: 150, height: 24, marginBottom: 16 }}
                />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton.Button
                  active
                  block
                  style={{ height: 35, marginTop: 16 }}
                />
              </div>

              {/* Financial Information Card Skeleton */}
              <div className="shadow-md rounded-xl border-0 mb-8 bg-white p-6">
                <Skeleton.Input
                  active
                  style={{ width: 180, height: 24, marginBottom: 16 }}
                />
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton.Input
                  active
                  style={{ width: 100, height: 30, marginBottom: 16 }}
                />
                <Skeleton.Button
                  active
                  block
                  style={{ height: 35, marginTop: 16 }}
                />
              </div>

              {/* Key Dates Card Skeleton */}
              <div className="shadow-md rounded-xl border-0 bg-white p-6">
                <Skeleton.Input
                  active
                  style={{ width: 120, height: 24, marginBottom: 16 }}
                />
                <div className="ml-4">
                  <div className="flex items-start mb-4">
                    <Skeleton.Avatar
                      active
                      size="small"
                      className="mt-1 mr-3"
                    />
                    <div>
                      <Skeleton.Input
                        active
                        style={{ width: 120, height: 16 }}
                      />
                      <Skeleton.Input
                        active
                        style={{ width: 140, height: 14, marginTop: 8 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Skeleton.Avatar
                      active
                      size="small"
                      className="mt-1 mr-3"
                    />
                    <div>
                      <Skeleton.Input
                        active
                        style={{ width: 130, height: 16 }}
                      />
                      <Skeleton.Input
                        active
                        style={{ width: 140, height: 14, marginTop: 8 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            Back to Papers
          </Button>
          <Empty
            description="Conference details not found"
            className="bg-white p-12 rounded-lg shadow-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/active-paper")}
          className="mb-6"
        >
          Back to Papers
        </Button>

        {/* Header Card */}
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
              {/* Gradient background with better height */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-600 to-teal-700 opacity-90"></div>

              <div className="relative px-6 pb-6">
                {/* Top section with header content */}
                <div className="pt-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <GlobalOutlined className="text-teal-600 text-3xl" />
                    </div>
                    <div className="ml-4 mt-4">
                      <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                        {conferenceDetails.conferenceName}
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <Tag
                      color={getStatusColor(
                        conferenceDetails.conferenceSubmissionStatus
                      )}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      {conferenceDetails.conferenceSubmissionStatusName}
                    </Tag>
                    <Tag
                      color={getRankingColor(
                        conferenceDetails.conferenceRanking
                      )}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      Ranking: {conferenceDetails.conferenceRankingName}
                    </Tag>
                  </div>
                </div>

                {/* Bottom section with additional info */}
                <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner flex flex-col md:flex-row justify-between">
                  <div className="flex flex-wrap gap-3 mb-3 md:mb-0">
                    <Tag
                      icon={<GlobalOutlined className="text-base" />}
                      color="teal"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      Conference
                    </Tag>
                    <Tag
                      icon={<ProjectOutlined className="text-base" />}
                      color="cyan"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      {conferenceDetails.projectName}
                    </Tag>
                    {conferenceDetails.location && (
                      <Tag
                        icon={<EnvironmentOutlined className="text-base" />}
                        color="purple"
                        className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                      >
                        {conferenceDetails.location}
                      </Tag>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Statistic
                      title="Funding"
                      value={conferenceDetails.conferenceFunding || 0}
                      precision={0}
                      formatter={(value) => (
                        <span className="text-teal-600 font-semibold">
                          {formatCurrency(value)}
                        </span>
                      )}
                      className="mr-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Conference Details - now wider */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <FileTextOutlined className="mr-2 text-teal-500" />
                    Conference Information
                  </span>
                }
                extra={
                  conferenceDetails.conferenceSubmissionStatus === 1 ? (
                    <Tooltip
                      title={
                        hasApprovedFunding
                          ? "Conference details cannot be modified after funding has been approved"
                          : "Update conference details"
                      }
                    >
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleOpenDetailsModal}
                        className={`bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none ${
                          hasApprovedFunding
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={hasApprovedFunding}
                      >
                        Update Details
                      </Button>
                    </Tooltip>
                  ) : null
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <Descriptions
                  bordered
                  column={1}
                  size="middle"
                  className="rounded-lg overflow-hidden"
                >
                  <Descriptions.Item label="Conference Name">
                    {conferenceDetails.conferenceName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ranking">
                    <Tag
                      color={getRankingColor(
                        conferenceDetails.conferenceRanking
                      )}
                    >
                      {conferenceDetails.conferenceRankingName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Presentation Type">
                    {getPresentationTypeLabel(
                      conferenceDetails.presentationType
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {conferenceDetails.location || "Not specified"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Presentation Date">
                    {formatDate(conferenceDetails.presentationDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Acceptance Date">
                    {formatDate(conferenceDetails.acceptanceDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submission Status">
                    <Tag
                      color={getStatusColor(
                        conferenceDetails.conferenceSubmissionStatus
                      )}
                    >
                      {conferenceDetails.conferenceSubmissionStatusName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Conference Status">
                    <Tag
                      color={
                        conferenceDetails.conferenceStatus === 0
                          ? "green"
                          : "red"
                      }
                    >
                      {conferenceDetails.conferenceStatusName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Conference Fee">
                    {formatCurrency(conferenceDetails.conferenceFunding)}
                  </Descriptions.Item>
                </Descriptions>

                {conferenceDetails.reviewerComment && (
                  <div className="mt-6">
                    <Title level={5} className="flex items-center mb-3">
                      <CommentOutlined className="mr-2 text-teal-500" />
                      Reviewer Comments
                    </Title>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <Paragraph>{conferenceDetails.reviewerComment}</Paragraph>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Documents Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <FileTextOutlined className="mr-2 text-teal-500" />
                    Conference Documents
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
                extra={
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    onClick={() => setIsUploadModalVisible(true)}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                  >
                    Upload Document
                  </Button>
                }
              >
                {conferenceDetails.documents &&
                conferenceDetails.documents.length > 0 ? (
                  (() => {
                    // Group documents by type
                    const groupedDocs = conferenceDetails.documents.reduce(
                      (acc, doc) => {
                        const type = doc.documentType;
                        if (!acc[type]) {
                          acc[type] = [];
                        }
                        acc[type].push(doc);
                        return acc;
                      },
                      {}
                    );

                    return (
                      <Collapse
                        defaultActiveKey={Object.keys(groupedDocs)}
                        className="border-0 bg-transparent"
                      >
                        {Object.entries(groupedDocs).map(([docType, docs]) => {
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
                                    <span
                                      className={`font-medium ${textColor}`}
                                    >
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
                                        size="small"
                                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                                        onClick={() =>
                                          window.open(doc.documentUrl, "_blank")
                                        }
                                      >
                                        Download
                                      </Button>,
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
                    );
                  })()
                ) : (
                  <Empty
                    description="No documents uploaded yet"
                    className="py-8"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Project Info and Status */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <ProjectOutlined className="mr-2 text-orange-500" />
                    Related Project
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {conferenceDetails.projectName}
                  </h3>
                  {/* <div className="flex items-center"> */}
                  <Tag
                    color={
                      conferenceDetails.projectStatus === 1
                        ? "success"
                        : "warning"
                    }
                    className="rounded-full px-3 py-1"
                  >
                    {conferenceDetails.projectStatus === 1
                      ? "Approved"
                      : "Pending"}
                  </Tag>
                  {/* </div> */}
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    navigate(`/project-details/${conferenceDetails.projectId}`)
                  }
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none shadow-sm"
                >
                  View Project
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <DollarOutlined className="mr-2 text-green-500" />
                    Financial Information
                    <div className="flex ml-2">
                      <Tooltip title="View Expense History">
                        <HistoryOutlined
                          className="ml-1 text-blue-500 cursor-pointer"
                          onClick={handleViewExpenseHistory}
                        />
                      </Tooltip>
                      <Tooltip title="View Funding History">
                        <DollarOutlined
                          className="ml-2 text-purple-500 cursor-pointer"
                          onClick={handleViewFundingHistory}
                        />
                      </Tooltip>
                    </div>
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <Statistic
                  title="Conference Funding"
                  value={conferenceDetails.conferenceFunding || 0}
                  precision={0}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#3f8600" }}
                  className="mb-4"
                />

                <div className="space-y-3 mt-4">
                  <Tooltip
                    title={
                      conferenceDetails.conferenceSubmissionStatus !== 1
                        ? "Conference must be approved first"
                        : hasApprovedExpense
                        ? "An expense request has already been approved for this conference"
                        : "Request travel and accommodation expenses"
                    }
                  >
                    <div className="w-full">
                      <Button
                        type="primary"
                        icon={<DollarOutlined />}
                        onClick={() => setIsExpenseModalVisible(true)}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none mb-3"
                        disabled={
                          conferenceDetails.conferenceSubmissionStatus !== 1 ||
                          hasApprovedExpense ||
                          isLoadingExpenses
                        }
                      >
                        {hasApprovedExpense
                          ? "Expense Already Approved"
                          : "Request Travel Expense"}
                      </Button>
                    </div>
                  </Tooltip>

                  <Tooltip
                    title={
                      conferenceDetails.conferenceSubmissionStatus !== 1
                        ? "Conference must be approved first"
                        : hasApprovedFunding
                        ? "A funding request has already been approved for this conference"
                        : conferenceDetails.conferenceFunding > 0
                        ? "You can only update location, dates, or upload additional documents. The funding amount cannot be modified."
                        : "Request funding for conference registration and related costs"
                    }
                  >
                    <div className="w-full">
                      <Button
                        type="primary"
                        icon={<DollarOutlined />}
                        onClick={() => setIsFundingModalVisible(true)}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                        disabled={
                          conferenceDetails.conferenceSubmissionStatus !== 1 ||
                          hasApprovedFunding
                        }
                      >
                        {hasApprovedFunding
                          ? "Funding Already Approved"
                          : conferenceDetails.conferenceFunding > 0
                          ? "Update Conference Funding"
                          : "Request Conference Funding"}
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-2 text-teal-500" />
                    Key Dates
                  </span>
                }
                className="shadow-md rounded-xl border-0"
              >
                <Timeline>
                  {conferenceDetails.acceptanceDate &&
                    new Date(conferenceDetails.acceptanceDate).getFullYear() >
                      1 && (
                      <Timeline.Item
                        color="green"
                        dot={
                          <CheckCircleOutlined className="timeline-clock-icon" />
                        }
                      >
                        <p>Paper Accepted</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(conferenceDetails.acceptanceDate)}
                        </p>
                      </Timeline.Item>
                    )}

                  {conferenceDetails.presentationDate &&
                    new Date(conferenceDetails.presentationDate).getFullYear() >
                      1 && (
                      <Timeline.Item
                        color={
                          new Date() >
                          new Date(conferenceDetails.presentationDate)
                            ? "green"
                            : "blue"
                        }
                        dot={
                          new Date() >
                          new Date(conferenceDetails.presentationDate) ? (
                            <CheckCircleOutlined className="timeline-clock-icon" />
                          ) : (
                            <ClockCircleOutlined className="timeline-clock-icon" />
                          )
                        }
                      >
                        <p>Presentation Date</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(conferenceDetails.presentationDate)}
                        </p>
                      </Timeline.Item>
                    )}
                </Timeline>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conference Details Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-teal-500 mr-2" />
            <span>Update Conference Details</span>
          </div>
        }
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-teal-50 p-4 rounded-lg mb-4 border border-teal-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-teal-700">
                Update Conference Details
              </Text>
              <Text className="text-teal-600 block">
                Please update the details for this approved conference
                submission.
                {areDatesAlreadySet() && (
                  <Text strong className="block mt-2 text-amber-600">
                    Note: Some fields are disabled because they've already been
                    set previously and cannot be modified.
                  </Text>
                )}
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={detailsForm}
          layout="vertical"
          onFinish={handleDetailsSubmit}
        >
          <Form.Item
            name="location"
            label="Conference Location"
            rules={[
              {
                required: true,
                message: "Please enter the conference location",
              },
              { min: 3, message: "Location must be at least 3 characters" },
              { max: 100, message: "Location cannot exceed 100 characters" },
            ]}
            tooltip={
              isLocationSet()
                ? "This location is already set and cannot be modified"
                : "Enter the location where the conference will be held"
            }
          >
            <Input
              placeholder="Enter the conference location"
              disabled={isLocationSet()}
            />
          </Form.Item>

          <Form.Item
            name="acceptanceDate"
            label="Acceptance Date"
            rules={[
              { required: true, message: "Please select the acceptance date" },
            ]}
            tooltip={
              isValidDate(conferenceDetails.acceptanceDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was accepted"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(conferenceDetails.acceptanceDate)}
              disabledDate={(current) =>
                !isValidDate(conferenceDetails.acceptanceDate) &&
                current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="presentationDate"
            label="Presentation Date"
            rules={[
              {
                required: true,
                message: "Please select the presentation date",
              },
            ]}
            tooltip={
              isValidDate(conferenceDetails.presentationDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when you'll present at the conference"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(conferenceDetails.presentationDate)}
              disabledDate={(current) => {
                if (isValidDate(conferenceDetails.presentationDate))
                  return true;
                const acceptanceDate =
                  detailsForm.getFieldValue("acceptanceDate");
                return acceptanceDate ? current < acceptanceDate : false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="conferenceFunding"
            label="Conference Funding (VND)"
            rules={[
              { required: true, message: "Please enter the funding amount" },
              { type: "number", min: 0, message: "Funding cannot be negative" },
              {
                type: "number",
                max: 1000000000,
                message: "Funding cannot exceed 1,000,000,000 VND",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1000000000}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsDetailsModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingDetails}
              disabled={isUpdatingDetails}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
            >
              {isUpdatingDetails ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FileOutlined className="text-2xl text-teal-500 mr-3" />
            <div>
              <span className="text-xl font-semibold">
                Upload Conference Documents
              </span>
            </div>
          </div>
        }
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <div className="bg-teal-50 p-4 rounded-lg mb-6 border border-teal-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-teal-700">
                Upload Conference Documents
              </Text>
              <Text className="text-teal-600 block">
                Please upload relevant documents for this conference submission.
              </Text>
            </div>
          </div>
        </div>

        <Form layout="vertical">
          <Form.Item
            label={
              <span className="text-gray-700 font-medium text-base">
                Conference Documents
              </span>
            }
            name="documents"
            rules={[
              {
                required: true,
                message: "Please upload at least one document",
              },
            ]}
            extra="Upload any relevant documents related to your conference paper"
          >
            <Upload.Dragger
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              multiple
              className="rounded-lg"
              beforeUpload={() => false} // Prevent auto-upload
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-teal-500" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or multiple file uploads (PDF, DOCX, etc.)
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setIsUploadModalVisible(false);
                setFileList([]);
              }}
              className="rounded-lg h-11"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleDocumentUpload}
              loading={isUploading}
              disabled={isUploading || fileList.length === 0}
              icon={<UploadOutlined />}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none h-11 flex items-center"
            >
              {isUploading ? "Uploading..." : "Upload Documents"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Expense Request Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-2xl text-teal-500 mr-3" />
            <div>
              <span className="text-xl font-semibold">
                Request Conference Expenses
              </span>
            </div>
          </div>
        }
        open={isExpenseModalVisible}
        onCancel={() => {
          setIsExpenseModalVisible(false);
          expenseForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <div className="bg-teal-50 p-4 rounded-lg mb-6 border border-teal-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-teal-700">
                Conference Expense Request
              </Text>
              <Text className="text-teal-600 block">
                Please provide details about your travel and accommodation
                expenses for this conference.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={expenseForm}
          layout="vertical"
          onFinish={handleExpenseSubmit}
        >
          <Form.Item
            name="travel"
            label="Travel Details"
            rules={[{ required: true, message: "Please enter travel details" }]}
          >
            <TextArea
              placeholder="Describe your travel arrangements (e.g., flight, train, car rental)"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="travelExpense"
            label="Travel Expense (VND)"
            rules={[
              { required: true, message: "Please enter travel expense amount" },
              { type: "number", min: 0, message: "Amount cannot be negative" },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
              placeholder="Enter travel expense amount"
            />
          </Form.Item>

          <Form.Item
            name="accommodation"
            label="Accommodation Details"
            rules={[
              { required: true, message: "Please enter accommodation details" },
            ]}
          >
            <TextArea
              placeholder="Describe your accommodation arrangements (e.g., hotel name, duration of stay)"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="accommodationExpense"
            label="Accommodation Expense (VND)"
            rules={[
              {
                required: true,
                message: "Please enter accommodation expense amount",
              },
              { type: "number", min: 0, message: "Amount cannot be negative" },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
              placeholder="Enter accommodation expense amount"
            />
          </Form.Item>

          <Form.Item
            label="Supporting Documents"
            name="documents"
            rules={[
              {
                required: true,
                message: "Please upload at least one supporting document",
              },
            ]}
            extra="Upload receipts, tickets, or other supporting documents for your expense request"
          >
            <Upload.Dragger
              fileList={expenseFileList}
              onChange={({ fileList: newFileList }) =>
                setExpenseFileList(newFileList)
              }
              multiple
              beforeUpload={() => false} // Prevent auto-upload
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-teal-500" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or multiple file uploads (PDF, JPG, PNG,
                etc.)
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setIsExpenseModalVisible(false);
                expenseForm.resetFields();
                setExpenseFileList([]);
              }}
              className="rounded-lg h-11"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isRequestingExpense || isUploadingExpenseDocuments}
              disabled={isRequestingExpense || isUploadingExpenseDocuments}
              icon={<DollarOutlined />}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none h-11 flex items-center"
            >
              {isRequestingExpense || isUploadingExpenseDocuments
                ? "Submitting..."
                : "Submit Request"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Expense History Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <HistoryOutlined className="text-blue-500 mr-2" />
            <span>Conference Expense History</span>
          </div>
        }
        open={isExpenseHistoryModalVisible}
        onCancel={() => setIsExpenseHistoryModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsExpenseHistoryModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={800}
        centered
        bodyStyle={{
          maxHeight: "70vh",
          overflow: "auto",
          padding: "12px 24px",
        }}
        destroyOnClose
      >
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-blue-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-blue-700">
                Conference Expense History
              </Text>
              <Text className="text-blue-600 block">
                This table shows all expense requests for this conference.
                {hasApprovedExpense && (
                  <Text strong className="text-green-600 block mt-1">
                    This conference has an approved expense request.
                  </Text>
                )}
              </Text>
            </div>
          </div>
        </div>

        {isLoadingExpenses ? (
          <div className="flex justify-center py-8">
            <Spin tip="Loading expense history..." />
          </div>
        ) : expensesResponse?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table
              dataSource={expensesResponse.data}
              rowKey="expenseId"
              pagination={false}
              scroll={{ x: "max-content" }}
              className="overflow-x-auto"
              expandable={{
                expandedRowRender: (record) => (
                  <div className="p-4 bg-gray-50 rounded">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="mb-2">
                          <Text strong>Accommodation Details:</Text>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            {record.accomodation || "No details provided"}
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="mb-2">
                          <Text strong>Travel Details:</Text>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            {record.travel || "No details provided"}
                          </div>
                        </div>
                      </Col>
                      {record.expenseStatus === 2 && record.rejectionReason && (
                        <Col span={24}>
                          <div className="mt-2">
                            <Text strong type="danger">
                              Rejection Reason:
                            </Text>
                            <div className="mt-1 p-2 bg-red-50 rounded border border-red-200 text-red-700">
                              {record.rejectionReason}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                ),
              }}
              columns={[
                {
                  title: "Accommodation",
                  dataIndex: "accomodation",
                  key: "accomodation",
                  width: 200,
                  ellipsis: true,
                  render: (text) => (
                    <Tooltip title={text}>
                      <div className="truncate">{text}</div>
                    </Tooltip>
                  ),
                },
                {
                  title: "Accommodation Expense",
                  dataIndex: "accomodationExpense",
                  key: "accomodationExpense",
                  width: 150,
                  render: (amount) => formatCurrency(amount),
                },
                {
                  title: "Travel",
                  dataIndex: "travel",
                  key: "travel",
                  width: 200,
                  ellipsis: true,
                  render: (text) => (
                    <Tooltip title={text}>
                      <div className="truncate">{text}</div>
                    </Tooltip>
                  ),
                },
                {
                  title: "Travel Expense",
                  dataIndex: "travelExpense",
                  key: "travelExpense",
                  width: 150,
                  render: (amount) => formatCurrency(amount),
                },
                {
                  title: "Status",
                  dataIndex: "expenseStatusName",
                  key: "expenseStatusName",
                  width: 120,
                  render: (status, record) => (
                    <Tag
                      color={
                        record.expenseStatus === 0
                          ? "gold"
                          : record.expenseStatus === 1
                          ? "green"
                          : "red"
                      }
                    >
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Reason",
                  dataIndex: "rejectionReason",
                  key: "rejectionReason",
                  width: 200,
                  ellipsis: true,
                  render: (reason, record) => {
                    if (record.expenseStatus === 2 && reason) {
                      return (
                        <Tooltip title={reason}>
                          <div className="truncate max-w-[150px]">{reason}</div>
                        </Tooltip>
                      );
                    }
                    return "-";
                  },
                },
              ]}
            />
          </div>
        ) : (
          <Empty description="No expense history found" />
        )}
      </Modal>

      {/* Funding Request Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-2xl text-teal-500 mr-3" />
            <div>
              <span className="text-xl font-semibold">
                Request Conference Funding
              </span>
            </div>
          </div>
        }
        open={isFundingModalVisible}
        onCancel={() => {
          setIsFundingModalVisible(false);
          fundingForm.resetFields();
          setFundingFileList([]);
        }}
        footer={null}
        width={600}
      >
        <div className="bg-teal-50 p-4 rounded-lg mb-6 border border-teal-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-teal-700">
                Conference Funding Request
              </Text>
              <Text className="text-teal-600 block">
                Please provide details for your conference funding request. The
                form below is pre-filled with current conference details.
                {areDatesAlreadySet() && (
                  <Text strong className="block mt-2 text-amber-600">
                    Note: Some fields are disabled because they've already been
                    set previously and cannot be modified.
                  </Text>
                )}
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={fundingForm}
          layout="vertical"
          onFinish={handleFundingSubmit}
          initialValues={{
            location: conferenceDetails.location || "",
            presentationDate: conferenceDetails.presentationDate
              ? dayjs(conferenceDetails.presentationDate)
              : null,
            acceptanceDate: conferenceDetails.acceptanceDate
              ? dayjs(conferenceDetails.acceptanceDate)
              : null,
            fundingAmount: conferenceDetails.conferenceFunding || 0,
          }}
        >
          <Form.Item
            name="location"
            label="Conference Location"
            rules={[
              {
                required: true,
                message: "Please enter the conference location",
              },
            ]}
            tooltip={
              isLocationSet()
                ? "This location is already set and cannot be modified"
                : "Enter the location where the conference will be held"
            }
          >
            <Input
              placeholder="Enter the conference location"
              disabled={isLocationSet()}
            />
          </Form.Item>

          <Form.Item
            name="presentationDate"
            label="Presentation Date"
            rules={[
              {
                required: true,
                message: "Please select the presentation date",
              },
            ]}
            tooltip={
              isValidDate(conferenceDetails.presentationDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when you'll present at the conference"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(conferenceDetails.presentationDate)}
              disabledDate={(current) => {
                if (isValidDate(conferenceDetails.presentationDate))
                  return true;
                const acceptanceDate =
                  fundingForm.getFieldValue("acceptanceDate");
                return acceptanceDate ? current < acceptanceDate : false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="acceptanceDate"
            label="Acceptance Date"
            rules={[
              { required: true, message: "Please select the acceptance date" },
            ]}
            tooltip={
              isValidDate(conferenceDetails.acceptanceDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was accepted"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(conferenceDetails.acceptanceDate)}
              disabledDate={(current) =>
                !isValidDate(conferenceDetails.acceptanceDate) &&
                current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="fundingAmount"
            label="Funding Amount (VND)"
            rules={[
              { required: true, message: "Please enter the funding amount" },
              { type: "number", min: 0, message: "Amount cannot be negative" },
              {
                type: "number",
                max: 1000000000,
                message: "Funding cannot exceed 1,000,000,000 VND",
              },
            ]}
            tooltip={
              conferenceDetails.conferenceFunding > 0
                ? "This funding amount is already set and cannot be modified"
                : "Enter the funding amount for this conference"
            }
          >
            <InputNumber
              min={0}
              max={1000000000}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
              placeholder="Enter funding amount"
              disabled={conferenceDetails.conferenceFunding > 0}
            />
          </Form.Item>

          <Form.Item
            label="Supporting Documents"
            name="documents"
            rules={[
              {
                required: true,
                message: "Please upload at least one supporting document",
              },
            ]}
            extra="Upload receipts, invoices, or other supporting documents for your funding request"
          >
            <Upload.Dragger
              fileList={fundingFileList}
              onChange={({ fileList: newFileList }) =>
                setFundingFileList(newFileList)
              }
              multiple
              beforeUpload={() => false} // Prevent auto-upload
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-teal-500" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or multiple file uploads (PDF, JPG, PNG,
                etc.)
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setIsFundingModalVisible(false);
                fundingForm.resetFields();
                setFundingFileList([]);
              }}
              className="rounded-lg h-11"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isRequestingFunding || isUploadingFundingDocuments}
              disabled={isRequestingFunding || isUploadingFundingDocuments}
              icon={<DollarOutlined />}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none h-11 flex items-center"
            >
              {isRequestingFunding || isUploadingFundingDocuments
                ? "Submitting..."
                : "Submit Request"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Funding History Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-purple-500 mr-2" />
            <span>Conference Funding History</span>
          </div>
        }
        open={isFundingHistoryModalVisible}
        onCancel={() => setIsFundingHistoryModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsFundingHistoryModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={800}
        centered
        bodyStyle={{
          maxHeight: "70vh",
          overflow: "auto",
          padding: "12px 24px",
        }}
        destroyOnClose
      >
        <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-purple-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-purple-700">
                Conference Funding History
              </Text>
              <Text className="text-purple-600 block">
                This table shows all funding requests for this conference.
                {hasApprovedFunding && (
                  <Text strong className="text-green-600 block mt-1">
                    This conference has an approved funding request.
                  </Text>
                )}
              </Text>
            </div>
          </div>
        </div>

        {isLoadingFunding ? (
          <div className="flex justify-center py-8">
            <Spin tip="Loading funding history..." />
          </div>
        ) : fundingResponse?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table
              dataSource={fundingResponse.data}
              rowKey="fundDisbursementId"
              pagination={false}
              scroll={{ x: "max-content" }}
              className="overflow-x-auto"
              expandable={{
                expandedRowRender: (record) => (
                  <div className="p-4 bg-gray-50 rounded">
                    <Row gutter={[16, 16]}>
                      {record.conferenceFundingDetail && (
                        <>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>Location:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {record.conferenceFundingDetail.location ||
                                  "No location provided"}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>Acceptance Date:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {formatDate(
                                  record.conferenceFundingDetail.acceptanceDate
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>Presentation Date:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {formatDate(
                                  record.conferenceFundingDetail
                                    .presentationDate
                                )}
                              </div>
                            </div>
                          </Col>
                        </>
                      )}
                      {record.description && (
                        <Col span={24}>
                          <div className="mb-2">
                            <Text strong>Description:</Text>
                            <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                              {record.description}
                            </div>
                          </div>
                        </Col>
                      )}
                      {record.status === 2 && record.rejectionReason && (
                        <Col span={24}>
                          <div className="mt-2">
                            <Text strong type="danger">
                              Rejection Reason:
                            </Text>
                            <div className="mt-1 p-2 bg-red-50 rounded border border-red-200 text-red-700">
                              {record.rejectionReason}
                            </div>
                          </div>
                        </Col>
                      )}
                      {record.documents && record.documents.length > 0 && (
                        <Col span={24}>
                          <Collapse className="border-0 bg-transparent">
                            <Panel
                              header={
                                <div className="flex items-center">
                                  <FileTextOutlined className="mr-2 text-purple-500" />
                                  <span>
                                    Related Documents ({record.documents.length}
                                    )
                                  </span>
                                </div>
                              }
                              key="documents"
                              className="mb-2 bg-white rounded-lg shadow-sm border border-gray-100"
                            >
                              <List
                                dataSource={record.documents}
                                renderItem={(doc) => {
                                  const typeVisuals = getDocumentTypeVisuals(
                                    doc.documentType
                                  );
                                  return (
                                    <List.Item
                                      actions={[
                                        <Button
                                          type="primary"
                                          icon={<DownloadOutlined />}
                                          size="small"
                                          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                                          onClick={() =>
                                            window.open(
                                              doc.documentUrl,
                                              "_blank"
                                            )
                                          }
                                        >
                                          Download
                                        </Button>,
                                      ]}
                                    >
                                      <List.Item.Meta
                                        avatar={
                                          <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${typeVisuals.bgColor} ${typeVisuals.textColor}`}
                                          >
                                            {typeVisuals.icon}
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
                                  );
                                }}
                              />
                            </Panel>
                          </Collapse>
                        </Col>
                      )}
                    </Row>
                  </div>
                ),
              }}
              columns={[
                {
                  title: "Request ID",
                  dataIndex: "fundDisbursementId",
                  key: "fundDisbursementId",
                  width: 100,
                },
                {
                  title: "Requested Amount",
                  dataIndex: "fundRequest",
                  key: "fundRequest",
                  width: 150,
                  render: (amount) => formatCurrency(amount),
                },
                {
                  title: "Request Date",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  width: 150,
                  render: (date) => formatDate(date),
                },
                {
                  title: "Requester",
                  dataIndex: "requesterName",
                  key: "requesterName",
                  width: 200,
                  ellipsis: true,
                  render: (name) => (
                    <Tooltip title={name}>
                      <div className="truncate">{name}</div>
                    </Tooltip>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "statusName",
                  key: "statusName",
                  width: 120,
                  render: (status, record) => (
                    <Tag
                      color={
                        record.status === 0
                          ? "gold"
                          : record.status === 1
                          ? "green"
                          : "red"
                      }
                    >
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Reviewed By",
                  dataIndex: "approvedByName",
                  key: "approvedByName",
                  width: 200,
                  ellipsis: true,
                  render: (name) =>
                    name ? (
                      <Tooltip title={name}>
                        <div className="truncate">{name}</div>
                      </Tooltip>
                    ) : (
                      "-"
                    ),
                },
              ]}
            />
          </div>
        ) : (
          <Empty description="No funding history found" />
        )}
      </Modal>
    </div>
  );
};

export default ActivePaperDetails;
