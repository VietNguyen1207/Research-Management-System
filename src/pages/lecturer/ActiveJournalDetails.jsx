import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Tag,
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Descriptions,
  Upload,
  Spin,
  Empty,
  Collapse,
  List,
  Avatar,
  Tooltip,
  message,
  Skeleton,
  Modal,
  Statistic,
  DatePicker,
  InputNumber,
  Table,
  Badge,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
  PaperClipOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  InboxOutlined,
  DollarOutlined,
  SaveOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetJournalDetailsQuery,
  useUploadJournalDocumentsMutation,
  useUpdateJournalDetailsMutation,
  useGetJournalFundingQuery,
  useRequestJournalFundingMutation,
  useUploadJournalFundingDocumentsMutation,
} from "../../features/project/journal/journalApiSlice";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
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

// Status mapping
const PUBLISHER_STATUS = {
  0: "Pending",
  1: "Rejected",
  2: "Approved",
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
        icon: <PaperClipOutlined />,
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
      };
    case 2: // Council Decision
      return {
        icon: <PaperClipOutlined />,
        color: "purple",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
      };
    case 3: // Conference Proposal
      return {
        icon: <PaperClipOutlined />,
        color: "orange",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      };
    case 4: // Journal Paper
      return {
        icon: <BookOutlined />,
        color: "purple",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
      };
    case 5: // Disbursement Confirmation
      return {
        icon: <PaperClipOutlined />,
        color: "lime",
        bgColor: "bg-lime-100",
        textColor: "text-lime-600",
      };
    case 6: // Project Completion
      return {
        icon: <PaperClipOutlined />,
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
    case 8:
    case 9:
    case 10:
    case 11: // Journal Funding
      return {
        icon: <PaperClipOutlined />,
        color: "purple",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
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

const ActiveJournalDetails = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isFundingModalVisible, setIsFundingModalVisible] = useState(false);
  const [isFundingHistoryModalVisible, setIsFundingHistoryModalVisible] =
    useState(false);
  const [fundingFileList, setFundingFileList] = useState([]);
  const [fundingForm] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const [uploadJournalDocuments, { isLoading: isUploading }] =
    useUploadJournalDocumentsMutation();
  const [updateJournalDetails, { isLoading: isUpdatingDetails }] =
    useUpdateJournalDetailsMutation();
  const [requestJournalFunding, { isLoading: isRequestingFunding }] =
    useRequestJournalFundingMutation();
  const [
    uploadJournalFundingDocuments,
    { isLoading: isUploadingFundingDocuments },
  ] = useUploadJournalFundingDocumentsMutation();

  // Fetch journal details
  const {
    data: journalResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetJournalDetailsQuery(journalId);

  // Fetch journal funding history
  const {
    data: fundingResponse,
    isLoading: isLoadingFunding,
    refetch: fetchFunding,
  } = useGetJournalFundingQuery(journalId, {
    // Always fetch funding data
  });

  const journalDetails = journalResponse?.data;

  // Add useEffect to fetch funding when the component loads
  useEffect(() => {
    if (journalId) {
      fetchFunding();
    }
  }, [journalId, fetchFunding]);

  // Add a function to check if there's already an approved funding request
  const hasApprovedFunding = useMemo(() => {
    if (!fundingResponse?.data) return false;
    return fundingResponse.data.some((funding) => funding.status === 1);
  }, [fundingResponse]);

  // Add useEffect to refetch data when component mounts
  useEffect(() => {
    if (journalId) {
      refetch();
    }
  }, [journalId, refetch]);

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).getFullYear() <= 1)
      return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return value ? `₫${value.toLocaleString()}` : "₫0";
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 0: // Pending
        return <Tag color="warning">Pending</Tag>;
      case 1: // Rejected
        return <Tag color="error">Rejected</Tag>;
      case 2: // Approved
        return <Tag color="success">Approved</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const handleViewFundingHistory = () => {
    setIsFundingHistoryModalVisible(true);
  };

  const handleUploadDocument = async () => {
    try {
      if (fileList.length === 0) {
        message.error("Please select at least one file to upload");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("documents", file.originFileObj);
      });

      await uploadJournalDocuments({
        journalId,
        formData,
      }).unwrap();

      message.success("Documents uploaded successfully");
      setIsUploadModalVisible(false);
      setFileList([]);
      refetch();
    } catch (error) {
      console.error("Failed to upload documents:", error);
      message.error(error.data?.message || "Failed to upload documents");
    }
  };

  // Add function to handle funding request
  const handleFundingRequest = () => {
    // Check if funding is already approved
    if (hasApprovedFunding) {
      message.error(
        "A funding request has already been approved for this journal"
      );
      return;
    }

    // Check if journal is approved
    if (journalDetails.publisherStatus !== 2) {
      message.error("Journal must be approved before requesting funding");
      return;
    }

    // Pre-populate form with existing data
    fundingForm.setFieldsValue({
      doiNumber: journalDetails.doiNumber || "",
      acceptanceDate: journalDetails.acceptanceDate
        ? dayjs(journalDetails.acceptanceDate)
        : null,
      publicationDate: journalDetails.publicationDate
        ? dayjs(journalDetails.publicationDate)
        : null,
      fundingAmount: journalDetails.journalFunding || 0,
    });
    setIsFundingModalVisible(true);
  };

  const handleFundingSubmit = async () => {
    try {
      const values = await fundingForm.validateFields();

      // Check if required documents are uploaded
      if (fundingFileList.length === 0) {
        message.error("Please upload at least one supporting document");
        return;
      }

      // Check if dates or DOI number are being set for the first time
      const isSettingDoiForFirstTime =
        !isDoiSet() && values.doiNumber && values.doiNumber.trim().length > 0;

      const isSettingDatesForFirstTime =
        (!isValidDate(journalDetails.acceptanceDate) &&
          values.acceptanceDate) ||
        (!isValidDate(journalDetails.publicationDate) &&
          values.publicationDate);

      // If setting DOI or dates for the first time, show confirmation
      if (isSettingDoiForFirstTime || isSettingDatesForFirstTime) {
        Modal.confirm({
          title: "Details cannot be modified later",
          icon: (
            <InfoCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />
          ),
          content: (
            <div className="py-2">
              <p className="mb-3">
                Please ensure that the DOI Number, Acceptance Date, and
                Publication Date you've entered are accurate.
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
              "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none",
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
            // Proceed with the funding request
            await submitFundingRequest(values);
          },
        });
      } else {
        // If not setting DOI or dates for the first time, proceed without confirmation
        await submitFundingRequest(values);
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

  // Helper function to submit the funding request
  const submitFundingRequest = async (values) => {
    try {
      // Prepare the data for API submission - respect already set values
      const fundingData = {
        journalId: parseInt(journalId),
        doiNumber: isDoiSet() ? journalDetails.doiNumber : values.doiNumber,
        acceptanceDate: isValidDate(journalDetails.acceptanceDate)
          ? journalDetails.acceptanceDate
          : values.acceptanceDate
          ? values.acceptanceDate.format("YYYY-MM-DD")
          : null,
        publicationDate: isValidDate(journalDetails.publicationDate)
          ? journalDetails.publicationDate
          : values.publicationDate
          ? values.publicationDate.format("YYYY-MM-DD")
          : null,
        journalFunding: values.fundingAmount,
      };

      // Step 1: Submit the funding request and get the requestId
      const fundingResponse = await requestJournalFunding({
        journalId,
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

      await uploadJournalFundingDocuments({
        journalId,
        requestId,
        formData,
      }).unwrap();

      message.success("Journal funding request submitted successfully");
      setIsFundingModalVisible(false);
      setFundingFileList([]);
      fundingForm.resetFields();

      // Refresh the journal details and funding history
      fetchFunding();
      refetch();
    } catch (error) {
      console.error("Failed to process funding request:", error);
      message.error(
        error.data?.message ||
          "Failed to process funding request. Please try again."
      );
    }
  };

  // Helper function to check if a date is valid
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getFullYear() > 1; // Check if it's a valid date (year > 1)
  };

  // Helper function to check if DOI is already set
  const isDoiSet = () => {
    return (
      journalDetails.doiNumber && journalDetails.doiNumber.trim().length > 0
    );
  };

  // Helper function to check if dates are already set
  const areDatesAlreadySet = () => {
    return (
      isValidDate(journalDetails.acceptanceDate) &&
      isValidDate(journalDetails.publicationDate)
    );
  };

  const handleDetailsSubmit = async () => {
    try {
      const values = await detailsForm.validateFields();

      // Check if funding is already approved
      if (hasApprovedFunding) {
        message.error(
          "Cannot modify journal details after funding has been approved"
        );
        setIsDetailsModalVisible(false);
        return;
      }

      // Check if dates or DOI number are being set for the first time
      const isSettingDoiForFirstTime =
        !isDoiSet() && values.doiNumber && values.doiNumber.trim().length > 0;

      const isSettingDatesForFirstTime =
        (!isValidDate(journalDetails.acceptanceDate) &&
          values.acceptanceDate) ||
        (!isValidDate(journalDetails.publicationDate) &&
          values.publicationDate);

      // If setting DOI or dates for the first time, show confirmation
      if (isSettingDoiForFirstTime || isSettingDatesForFirstTime) {
        Modal.confirm({
          title: "Details cannot be modified later",
          icon: (
            <InfoCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />
          ),
          content: (
            <div className="py-2">
              <p className="mb-3">
                Please ensure that the DOI Number, Acceptance Date, and
                Publication Date you've entered are accurate.
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
              "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none",
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
            await updateWithFormattedValues(values);
          },
        });
      } else {
        // If not setting DOI or dates for the first time, proceed without confirmation
        await updateWithFormattedValues(values);
      }
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to update journal details:", error);
        message.error(
          error.data?.message ||
            "Failed to update journal details. Please try again."
        );
      }
    }
  };

  // Helper function to update journal details with formatted values
  const updateWithFormattedValues = async (values) => {
    // Prepare data for API - respect already set values
    const detailsData = {
      doiNumber: isDoiSet() ? journalDetails.doiNumber : values.doiNumber,
      acceptanceDate: isValidDate(journalDetails.acceptanceDate)
        ? journalDetails.acceptanceDate
        : values.acceptanceDate
        ? values.acceptanceDate.format("YYYY-MM-DD")
        : null,
      publicationDate: isValidDate(journalDetails.publicationDate)
        ? journalDetails.publicationDate
        : values.publicationDate
        ? values.publicationDate.format("YYYY-MM-DD")
        : null,
      journalFunding: values.journalFunding,
    };

    // Call the API
    await updateJournalDetails({
      journalId,
      detailsData,
    }).unwrap();

    message.success("Journal details updated successfully");
    setIsDetailsModalVisible(false);
    refetch(); // Refresh the journal details
  };

  const handleOpenDetailsModal = () => {
    // Check if funding is already approved
    if (hasApprovedFunding) {
      message.error(
        "Cannot modify journal details after funding has been approved"
      );
      return;
    }

    // Pre-populate the form with existing data
    detailsForm.setFieldsValue({
      doiNumber: journalDetails.doiNumber || "",
      acceptanceDate: journalDetails.acceptanceDate
        ? dayjs(journalDetails.acceptanceDate)
        : null,
      publicationDate: journalDetails.publicationDate
        ? dayjs(journalDetails.publicationDate)
        : null,
      journalFunding: journalDetails.journalFunding || 0,
    });
    setIsDetailsModalVisible(true);
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
              <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-purple-700 opacity-90"></div>

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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
            <div className="lg:col-span-1">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            Back
          </Button>
          <Empty
            description={`Error loading journal details: ${
              error?.data?.message || "Unknown error"
            }`}
            className="bg-white p-12 rounded-lg shadow-sm"
          />
        </div>
      </div>
    );
  }

  if (!journalDetails) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            Back
          </Button>
          <Empty
            description="Journal details not found"
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
              {/* Gradient background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-purple-700 opacity-90"></div>

              <div className="relative px-6 pb-6">
                {/* Top section with header content */}
                <div className="pt-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <BookOutlined className="text-purple-600 text-3xl" />
                    </div>
                    <div className="ml-4 mt-4">
                      <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                        {journalDetails.journalName}
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <Tag
                      color={
                        journalDetails.publisherStatus === 0
                          ? "warning"
                          : journalDetails.publisherStatus === 1
                          ? "error"
                          : "success"
                      }
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      {PUBLISHER_STATUS[journalDetails.publisherStatus] ||
                        "Unknown"}
                    </Tag>
                  </div>
                </div>

                {/* Bottom section */}
                <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner flex flex-col md:flex-row justify-between">
                  <div className="flex flex-wrap gap-3 mb-3 md:mb-0">
                    <Tag
                      icon={<BookOutlined className="text-base" />}
                      color="purple"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      Journal Paper
                    </Tag>
                    <Tag
                      icon={<ProjectOutlined className="text-base" />}
                      color="cyan"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      {journalDetails.projectName}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Journal Details - now wider */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <BookOutlined className="mr-2 text-purple-500" />
                    Journal Information
                  </span>
                }
                extra={
                  journalDetails.publisherStatus === 2 ? (
                    <Tooltip
                      title={
                        hasApprovedFunding
                          ? "Cannot modify journal details after funding has been approved"
                          : "Update journal details"
                      }
                    >
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleOpenDetailsModal}
                        className={`bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none ${
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
                  <Descriptions.Item label="Journal Name">
                    {journalDetails.journalName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Publisher">
                    {journalDetails.publisherName}
                  </Descriptions.Item>
                  <Descriptions.Item label="DOI Number">
                    {journalDetails.doiNumber ? (
                      <a
                        href={`https://doi.org/${journalDetails.doiNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 underline"
                      >
                        {journalDetails.doiNumber}{" "}
                        <FileTextOutlined className="ml-1" />
                      </a>
                    ) : (
                      "Not assigned yet"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submission Date">
                    {formatDate(journalDetails.submissionDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Acceptance Date">
                    {formatDate(journalDetails.acceptanceDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Publication Date">
                    {formatDate(journalDetails.publicationDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submission Status">
                    {getStatusTag(journalDetails.publisherStatus)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Journal Fee">
                    {journalDetails.journalFunding
                      ? `₫${journalDetails.journalFunding.toLocaleString()}`
                      : "Not set"}
                  </Descriptions.Item>
                </Descriptions>

                {journalDetails.reviewerComments && (
                  <div className="mt-6">
                    <Title level={5} className="flex items-center mb-3">
                      <InfoCircleOutlined className="mr-2 text-purple-500" />
                      Reviewer Comments
                    </Title>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <Paragraph>{journalDetails.reviewerComments}</Paragraph>
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
                    <FileTextOutlined className="mr-2 text-purple-500" />
                    Journal Documents
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
                extra={
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setIsUploadModalVisible(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none"
                  >
                    Upload Document
                  </Button>
                }
              >
                {journalDetails.documents &&
                journalDetails.documents.length > 0 ? (
                  (() => {
                    // Group documents by type
                    const groupedDocs = journalDetails.documents.reduce(
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
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none"
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

          {/* Right Column - Project Info */}
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
                    {journalDetails.projectName}
                  </h3>
                  {/* <div className="flex items-center"> */}
                  <Tag
                    color={
                      journalDetails.projectStatus === 1 ? "success" : "warning"
                    }
                    className="rounded-full px-3 py-1"
                  >
                    {journalDetails.projectStatus === 1
                      ? "Approved"
                      : "Pending"}
                  </Tag>
                  {/* </div> */}
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    navigate(`/project-details/${journalDetails.projectId}`)
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
                  title="Journal Funding"
                  value={journalDetails.journalFunding || 0}
                  precision={0}
                  formatter={(value) =>
                    value ? `₫${value.toLocaleString()}` : "₫0"
                  }
                  valueStyle={{ color: "#3f8600" }}
                  className="mb-4"
                />

                <div className="space-y-3 mt-4">
                  <Tooltip
                    title={
                      journalDetails.publisherStatus !== 2
                        ? "Journal must be approved first"
                        : hasApprovedFunding
                        ? "A funding request has already been approved for this journal"
                        : "Request funding for journal publication costs"
                    }
                  >
                    <div className="w-full">
                      <Button
                        type="primary"
                        icon={<DollarOutlined />}
                        onClick={handleFundingRequest}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none"
                        disabled={
                          journalDetails.publisherStatus !== 2 ||
                          hasApprovedFunding
                        }
                      >
                        {hasApprovedFunding
                          ? "Funding Already Approved"
                          : "Request Journal Funding"}
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
                    <FileTextOutlined className="mr-2 text-purple-500" />
                    Journal Status Timeline
                  </span>
                }
                className="shadow-md rounded-xl border-0"
              >
                {journalDetails.submissionDate ||
                journalDetails.acceptanceDate ||
                journalDetails.publicationDate ? (
                  <Space direction="vertical" size="large" className="w-full">
                    {journalDetails.submissionDate && (
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                          <FileTextOutlined className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Submitted</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(journalDetails.submissionDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {journalDetails.acceptanceDate && (
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                          <CheckCircleOutlined className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Accepted</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(journalDetails.acceptanceDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {journalDetails.publicationDate && (
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                          <BookOutlined className="text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">Published</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(journalDetails.publicationDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </Space>
                ) : (
                  <Empty
                    description="No timeline events yet"
                    className="py-4"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <UploadOutlined className="text-purple-500 mr-2" />
            <span>Upload Journal Documents</span>
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
        <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-purple-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-purple-700">
                Upload Journal Documents
              </Text>
              <Text className="text-purple-600 block">
                Please upload relevant documents for this journal submission.
              </Text>
            </div>
          </div>
        </div>

        <Form layout="vertical">
          <Form.Item
            label={
              <span className="text-gray-700 font-medium text-base">
                Journal Documents
              </span>
            }
            name="documents"
            rules={[
              {
                required: true,
                message: "Please upload at least one document",
              },
            ]}
            extra="Upload any relevant documents related to your journal paper"
          >
            <Upload.Dragger
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              multiple
              beforeUpload={() => false} // Prevent auto-upload
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-purple-500" />
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
              onClick={handleUploadDocument}
              loading={isUploading}
              disabled={isUploading || fileList.length === 0}
              icon={<UploadOutlined />}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none h-11 flex items-center"
            >
              {isUploading ? "Uploading..." : "Upload Documents"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Journal Funding Request Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-2xl text-purple-500 mr-3" />
            <div>
              <span className="text-xl font-semibold">
                Request Journal Funding
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
        <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-purple-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-purple-700">
                Journal Funding Request
              </Text>
              <Text className="text-purple-600 block">
                Please provide the journal's publication details and the funding
                amount needed.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={fundingForm}
          layout="vertical"
          onFinish={handleFundingSubmit}
        >
          <Form.Item
            name="doiNumber"
            label="DOI Number"
            rules={[
              { required: true, message: "Please enter the DOI number" },
              {
                pattern: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
                message:
                  "Please enter a valid DOI number (e.g., 10.1234/example)",
              },
            ]}
            tooltip={
              isDoiSet()
                ? "This DOI number is already set and cannot be modified"
                : "Enter the DOI number for this journal publication"
            }
          >
            <Input placeholder="e.g., 10.1234/example" disabled={isDoiSet()} />
          </Form.Item>

          <Form.Item
            name="acceptanceDate"
            label="Acceptance Date"
            rules={[
              { required: true, message: "Please select the acceptance date" },
            ]}
            tooltip={
              isValidDate(journalDetails.acceptanceDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was accepted"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(journalDetails.acceptanceDate)}
              disabledDate={(current) => {
                // Can't select dates in the future
                if (current > dayjs().endOf("day")) return true;

                // If publication date is selected, acceptance must be before it
                const pubDate = fundingForm.getFieldValue("publicationDate");
                if (pubDate && current > pubDate) return true;

                return false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="publicationDate"
            label="Publication Date"
            rules={[
              { required: true, message: "Please select the publication date" },
            ]}
            tooltip={
              isValidDate(journalDetails.publicationDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was published"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(journalDetails.publicationDate)}
              disabledDate={(current) => {
                // Can't select dates in the future
                if (current > dayjs().endOf("day")) return true;

                // Publication date must be after acceptance date
                const acceptDate = fundingForm.getFieldValue("acceptanceDate");
                if (acceptDate && current < acceptDate) return true;

                return false;
              }}
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
                message: "Amount cannot exceed 1,000,000,000 VND",
              },
            ]}
            tooltip={
              journalDetails.journalFunding > 0
                ? "This funding amount is already set and cannot be modified"
                : "Enter the funding amount for this journal publication"
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
              disabled={journalDetails.journalFunding > 0}
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
                <InboxOutlined className="text-purple-500" />
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
              icon={<DollarOutlined />}
              loading={isRequestingFunding || isUploadingFundingDocuments}
              disabled={isRequestingFunding || isUploadingFundingDocuments}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none h-11 flex items-center"
            >
              {isRequestingFunding || isUploadingFundingDocuments
                ? "Submitting..."
                : "Submit Funding Request"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Journal Details Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-purple-500 mr-2" />
            <span>Update Journal Details</span>
          </div>
        }
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-purple-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-purple-700">
                Update Journal Details
              </Text>
              <Text className="text-purple-600 block">
                Please provide the updated information for this journal
                publication.
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
            name="doiNumber"
            label="DOI Number"
            rules={[
              { required: true, message: "Please enter the DOI number" },
              {
                pattern: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
                message:
                  "Please enter a valid DOI number (e.g., 10.1234/example)",
              },
            ]}
            tooltip={
              isDoiSet()
                ? "This DOI number is already set and cannot be modified"
                : "Enter the DOI number for this journal publication"
            }
          >
            <Input placeholder="e.g., 10.1234/example" disabled={isDoiSet()} />
          </Form.Item>

          <Form.Item
            name="acceptanceDate"
            label="Acceptance Date"
            rules={[
              { required: true, message: "Please select the acceptance date" },
            ]}
            tooltip={
              isValidDate(journalDetails.acceptanceDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was accepted"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(journalDetails.acceptanceDate)}
              disabledDate={(current) => {
                // Can't select dates in the future
                if (current > dayjs().endOf("day")) return true;

                // If publication date is selected, acceptance must be before it
                const pubDate = detailsForm.getFieldValue("publicationDate");
                if (pubDate && current > pubDate) return true;

                return false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="publicationDate"
            label="Publication Date"
            rules={[
              { required: true, message: "Please select the publication date" },
            ]}
            tooltip={
              isValidDate(journalDetails.publicationDate)
                ? "This date is already set and cannot be modified"
                : "Select the date when your paper was published"
            }
          >
            <DatePicker
              className="w-full"
              disabled={isValidDate(journalDetails.publicationDate)}
              disabledDate={(current) => {
                // Can't select dates in the future
                if (current > dayjs().endOf("day")) return true;

                // Publication date must be after acceptance date
                const acceptDate = detailsForm.getFieldValue("acceptanceDate");
                if (acceptDate && current < acceptDate) return true;

                return false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="journalFunding"
            label="Journal Funding (VND)"
            rules={[
              { required: true, message: "Please enter the funding amount" },
              { type: "number", min: 0, message: "Amount cannot be negative" },
              {
                type: "number",
                max: 1000000000,
                message: "Amount cannot exceed 1,000,000,000 VND",
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
            <Button
              onClick={() => setIsDetailsModalVisible(false)}
              className="rounded-lg h-11"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingDetails}
              disabled={isUpdatingDetails}
              icon={<SaveOutlined />}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none h-11 flex items-center"
            >
              {isUpdatingDetails ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Journal Funding History Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-purple-500 mr-2" />
            <span>Journal Funding History</span>
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
                Journal Funding History
              </Text>
              <Text className="text-purple-600 block">
                This table shows all funding requests for this journal.
                {hasApprovedFunding && (
                  <Text strong className="text-green-600 block mt-1">
                    This journal has an approved funding request.
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
                      {record.journalFundingDetail && (
                        <>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>DOI Number:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {record.journalFundingDetail.doiNumber ? (
                                  <a
                                    href={`https://doi.org/${record.journalFundingDetail.doiNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-800 underline"
                                  >
                                    {record.journalFundingDetail.doiNumber}
                                    <FileTextOutlined className="ml-1" />
                                  </a>
                                ) : (
                                  "Not provided"
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>Acceptance Date:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {formatDate(
                                  record.journalFundingDetail.acceptanceDate
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="mb-2">
                              <Text strong>Publication Date:</Text>
                              <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                                {formatDate(
                                  record.journalFundingDetail.publicationDate
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
                                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none"
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

export default ActiveJournalDetails;
