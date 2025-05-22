import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Spin,
  Card,
  Modal,
  Result,
  Alert,
  Tag,
} from "antd";
import {
  FileOutlined,
  SaveOutlined,
  SendOutlined,
  UserOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  InboxOutlined,
  CheckCircleFilled,
  HomeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  GROUP_STATUS,
  useGetUserResearchGroupsQuery,
} from "../features/group/groupApiSlice";
import { useGetDepartmentsQuery } from "../features/department/departmentApiSlice";
import {
  useRegisterResearchProjectMutation,
  useUploadProjectDocumentMutation,
} from "../features/project/projectApiSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { PROJECT_RESOURCE_TYPE } from "../constants/enums";
import { useGetCategoriesQuery } from "../features/category/categoryApiSlice";

const { TextArea } = Input;

const RegisterResearch = () => {
  const [form] = Form.useForm();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const [fileList, setFileList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [registeredProjectId, setRegisteredProjectId] = useState(null);
  const [registeredProjectName, setRegisteredProjectName] = useState("");
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  // Fetch departments data
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  // Fetch student groups for the current user
  const {
    data: userGroups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useGetUserResearchGroupsQuery(userId);

  // Register research project mutation
  const [registerProject, { isLoading: isSubmitting }] =
    useRegisterResearchProjectMutation();

  // Add upload document mutation
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadProjectDocumentMutation();

  // Budget category limits as percentage of total budget
  const BUDGET_CATEGORY_LIMITS = {
    RESEARCH_TEAM: 1.0, // 100%
    EQUIPMENT_SUPPLIES: 0.6, // 60%
    EXTERNAL_SERVICES: 0.6, // 60%
    PAPER_EXPENSE: 0.3, // 30%
    OTHER_COSTS: 0.2, // 20%
    CONTINGENCY: 0.1, // 10%
  };

  // Mapping resource types to budget categories
  const getBudgetCategory = (resourceType) => {
    switch (resourceType) {
      case 1: // Human
      case 6: // Personnel
        return "RESEARCH_TEAM";

      case 2: // Equipment
      case 5: // Material
      case 3: // Software
      case 11: // Dataset
        return "EQUIPMENT_SUPPLIES";

      case 7: // Facility
        return "EXTERNAL_SERVICES";

      case 9: // Conference
      case 8: // Travel
      case 10: // Journal
        return "PAPER_EXPENSE";

      case 4: // Document
      case 12: // Other
      default:
        return "OTHER_COSTS";
    }
  };

  // Function to validate budget allocations
  const validateBudgetAllocations = (resources, totalBudget) => {
    if (!resources || resources.length === 0 || !totalBudget) {
      return { valid: true };
    }

    // Calculate spending by category - DON'T multiply by quantity
    const categoryTotals = resources.reduce((acc, resource) => {
      const category = getBudgetCategory(resource.proposedResourceType);
      const cost = resource.proposedResourceCost; // Don't multiply by quantity
      acc[category] = (acc[category] || 0) + cost;
      return acc;
    }, {});

    // Calculate total allocated cost across all categories
    const totalAllocated = Object.values(categoryTotals).reduce(
      (sum, cost) => sum + cost,
      0
    );

    // Check if any category exceeds its limit
    const validations = {};
    let isValid = true;

    // First check if total allocation exceeds budget
    if (totalAllocated > totalBudget) {
      isValid = false;
      validations["TOTAL"] = {
        valid: false,
        message: `Total resource costs exceed the available budget`,
        limit: totalBudget,
        actual: totalAllocated,
      };
    }

    // Then check individual categories
    Object.entries(categoryTotals).forEach(([category, total]) => {
      const limit = BUDGET_CATEGORY_LIMITS[category] * totalBudget;
      const valid = total <= limit;

      if (!valid) {
        isValid = false;
        validations[category] = {
          valid,
          message: `${getCategoryName(
            category
          )} costs exceed the allowed limit of ${
            BUDGET_CATEGORY_LIMITS[category] * 100
          }% of total budget`,
          limit,
          actual: total,
        };
      }
    });

    return {
      valid: isValid,
      validations,
      categoryTotals,
      totalAllocated,
    };
  };

  // Helper to get a readable category name
  const getCategoryName = (category) => {
    switch (category) {
      case "RESEARCH_TEAM":
        return "Research Team";
      case "EQUIPMENT_SUPPLIES":
        return "Equipment & Supplies";
      case "EXTERNAL_SERVICES":
        return "External Services";
      case "PAPER_EXPENSE":
        return "Paper Expenses";
      case "OTHER_COSTS":
        return "Other Costs";
      case "CONTINGENCY":
        return "Contingency";
      default:
        return category;
    }
  };

  // Add this function definition after the getCategoryName function
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₫ 0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Inside the RegisterResearch component, add this query hook
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const onFinish = async (values) => {
    try {
      // Validate budget allocations
      const totalBudget = values.budget;
      const budgetValidation = validateBudgetAllocations(
        values.proposedResources,
        totalBudget
      );

      if (!budgetValidation.valid) {
        // Show detailed error messages
        const errorMessages = Object.values(budgetValidation.validations)
          .map(
            (v) =>
              `- ${v.message} (${formatCurrency(v.actual)} > ${formatCurrency(
                v.limit
              )})`
          )
          .join("\n");

        Modal.error({
          title: "Budget validation failed",
          content: (
            <div>
              <p>Your resource allocations exceed the allowed budget limits:</p>
              <pre className="mt-2 p-3 bg-gray-50 rounded border text-red-600 text-sm whitespace-pre-wrap">
                {errorMessages}
              </pre>
              <p className="mt-3">
                Please adjust your resource costs to comply with budget
                guidelines.
              </p>
            </div>
          ),
        });
        return;
      }

      // Function to format dates with fixed time at noon (12:00 PM)
      const formatDate = (date) => {
        if (!date) return null;

        // We're already working with a moment object from DatePicker
        // Just set the time to 12:00 PM
        const dateWithTime = date.clone(); // Clone to avoid mutating the original

        dateWithTime.set({
          hour: 12,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        // Return in ISO format
        return dateWithTime.format("YYYY-MM-DDTHH:mm:ss");
      };

      // Transform project phases to match API requirements
      const projectPhases = values.projectPhases.map((phase) => ({
        title: phase.title,
        startDate: formatDate(phase.startDate || values.timeline.start),
        endDate: formatDate(phase.endDate || values.timeline.end),
      }));

      // Ensure proposed resources have correct structure and types
      const proposedResources = values.proposedResources.map((resource) => ({
        proposedResourceName: resource.proposedResourceName,
        proposedResourceQuantity: Number(resource.proposedResourceQuantity),
        proposedResourceCost: Number(resource.proposedResourceCost),
        proposedResourceType: Number(resource.proposedResourceType),
      }));

      // Prepare request payload
      const projectData = {
        projectName: values.title,
        description: values.description,
        methodology: values.methodology,
        startDate: formatDate(values.timeline.start),
        endDate: formatDate(values.timeline.end),
        approvedBudget: values.budget,
        groupId: values.group_id,
        departmentId: values.department_id,
        projectPhases: projectPhases,
        proposedResources: proposedResources,
        categoryIds: values.categories || [],
      };

      console.log("Sending project data:", projectData);

      // Step 1: Register the project first
      const response = await registerProject(projectData).unwrap();

      // Extract project ID from response message using regex
      const projectIdMatch = response.message?.match(/Project ID: (\d+)/);
      const projectId = projectIdMatch ? projectIdMatch[1] : null;

      console.log("Project created successfully with ID:", projectId);
      setRegisteredProjectId(projectId);
      setRegisteredProjectName(values.title);

      // Step 2: If we have files and a valid project ID, upload the documents
      if (fileList.length > 0 && projectId) {
        try {
          // Create a FormData object
          const formData = new FormData();

          // Append all files to the FormData with the correct field name 'documentFiles'
          fileList.forEach((file) => {
            if (file.originFileObj) {
              formData.append("documentFiles", file.originFileObj);
            }
          });

          // Call the upload API
          await uploadDocument({ projectId, formData }).unwrap();

          // Show success modal instead of message
          setIsSuccessModalVisible(true);
        } catch (uploadError) {
          console.error("Error uploading documents:", uploadError);
          message.warning(
            "Project was created successfully, but document upload failed. You can upload documents later."
          );
          // Still show success modal since project was created
          setIsSuccessModalVisible(true);
        }
      } else {
        // Show success modal with no document uploaded
        setIsSuccessModalVisible(true);
      }

      // Reset form after all operations are complete
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error registering project:", error);
      message.error(
        error.data?.message ||
          "Failed to register research project. Please try again."
      );
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    // Keep the fileList state updated
    setFileList(newFileList);
  };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
  };

  // Find leader for a group
  const getGroupLeader = (members) => {
    return members.find((m) => m.role === 0 && m.status === 1);
  };

  // Handle potential errors in group data
  useEffect(() => {
    if (groupsError) {
      message.error("Failed to load research groups. Please try again later.");
    }
  }, [groupsError]);

  // Also add a function that can be called when form values change to provide real-time feedback
  const [budgetStatus, setBudgetStatus] = useState({
    valid: true,
    categoryTotals: {},
  });

  // Create a form values change handler to update budget status in real time
  const handleFormValuesChange = (changedValues, allValues) => {
    if (changedValues.budget || changedValues.proposedResources) {
      const resources = allValues.proposedResources;
      const budget = allValues.budget;

      if (resources && budget) {
        // Map resources to the correct format for validation
        const formattedResources = resources.map((r) => ({
          proposedResourceType: Number(r.proposedResourceType) || 0,
          proposedResourceCost: Number(r.proposedResourceCost) || 0,
          proposedResourceQuantity: Number(r.proposedResourceQuantity) || 0,
        }));

        const validation = validateBudgetAllocations(
          formattedResources,
          budget
        );
        setBudgetStatus(validation);
      }
    }
  };

  // Add this function after your existing hooks
  const onFinishFailed = (errorInfo) => {
    // Extract field names and errors
    const errors = errorInfo.errorFields.map((field) => ({
      name: field.name.join(" > "),
      errors: field.errors,
    }));

    setFormErrors(errors);
    setShowErrorSummary(true);

    // Automatically scroll to the error summary
    setTimeout(() => {
      document.getElementById("error-summary")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Register New Research
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please provide detailed information about your research project
          </p>
        </div>

        {/* Error Summary - add this before the form */}
        {showErrorSummary && formErrors.length > 0 && (
          <Alert
            id="error-summary"
            message="Please fix the following errors:"
            description={
              <ul className="list-disc ml-4">
                {formErrors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    <b>{error.name}</b>: {error.errors[0]}
                  </li>
                ))}
              </ul>
            }
            type="error"
            closable
            onClose={() => setShowErrorSummary(false)}
            className="mb-6"
            showIcon
          />
        )}

        <Form
          form={form}
          name="register_research"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError
          className="space-y-8"
          initialValues={{
            type: "research",
            status: "pending",
          }}
          onValuesChange={handleFormValuesChange}
        >
          {/* Basic Information Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <FileTextOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the fundamental details of your research
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* hidden type field */}
              <Form.Item name="type" hidden>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Project Title
                  </span>
                }
                name="title"
                rules={[
                  { required: true, message: "Please input project title!" },
                ]}
              >
                <Input
                  prefix={<FileTextOutlined className="text-gray-400" />}
                  placeholder="Enter the project title"
                  className="rounded-lg py-2.5"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Project Description
                  </span>
                }
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input project description!",
                  },
                ]}
              >
                <TextArea
                  placeholder="Describe the project in detail"
                  rows={4}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Research Categories
                  </span>
                }
                name="categories"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one category!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select research categories"
                  }
                  className="rounded-lg"
                  loading={isLoadingCategories}
                  disabled={isLoadingCategories}
                  optionFilterProp="label"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {categories?.map((category) => (
                    <Select.Option
                      key={category.categoryId}
                      value={category.categoryId}
                      label={category.categoryName}
                    >
                      {category.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* Project Details Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <FileTextOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the details of your research
                </p>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium text-base">
                  Research Methodology
                </span>
              }
              name="methodology"
              rules={[
                {
                  required: true,
                  message: "Please input research methodology!",
                },
              ]}
            >
              <TextArea
                placeholder="Describe your research methodology"
                rows={4}
                className="rounded-lg"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Department
                  </span>
                }
                name="department_id"
                rules={[
                  { required: true, message: "Please select a department!" },
                ]}
              >
                <Select
                  placeholder={
                    isLoadingDepartments
                      ? "Loading departments..."
                      : "Select a department"
                  }
                  className="rounded-lg"
                  suffixIcon={<BankOutlined className="text-gray-400" />}
                  onChange={handleDepartmentChange}
                  loading={isLoadingDepartments}
                  disabled={isLoadingDepartments}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {departments?.map((dept) => (
                    <Select.Option
                      key={dept.departmentId}
                      value={dept.departmentId}
                      label={dept.departmentName}
                    >
                      {dept.departmentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Budget (VND)
                  </span>
                }
                name="budget"
                rules={[{ required: true, message: "Please input budget!" }]}
              >
                <InputNumber
                  prefix={<DollarOutlined className="text-gray-400" />}
                  placeholder="Enter proposed budget"
                  className="w-full rounded-lg"
                  formatter={(value) =>
                    `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
          </Card>

          {/* Team members Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <TeamOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Research Group
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Select your research group
                </p>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Research Group
                </span>
              }
              name="group_id"
              rules={[
                {
                  required: true,
                  message: "Please select a research group!",
                },
              ]}
            >
              <Select
                placeholder={
                  isLoadingGroups
                    ? "Loading research groups..."
                    : "Select a research group"
                }
                className="rounded-lg"
                suffixIcon={<TeamOutlined className="text-gray-400" />}
                loading={isLoadingGroups}
                disabled={isLoadingGroups}
                optionLabelProp="label"
                dropdownMatchSelectWidth={true}
                style={{ width: "100%" }}
                notFoundContent={
                  isLoadingGroups ? (
                    <Spin size="small" />
                  ) : userGroups?.filter(
                      (group) => group.status === GROUP_STATUS.ACTIVE
                    )?.length === 0 ? (
                    <div className="py-2 px-3 text-gray-500">
                      No active research groups available. Please create a group
                      first.
                    </div>
                  ) : null
                }
              >
                {userGroups
                  ?.filter((group) => group.status === GROUP_STATUS.ACTIVE)
                  ?.map((group) => {
                    const leader = getGroupLeader(group.members);
                    return (
                      <Select.Option
                        key={group.groupId}
                        value={group.groupId}
                        label={group.groupName}
                      >
                        <div className="w-full">
                          <div className="font-medium truncate">
                            {group.groupName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {leader
                              ? `Leader: ${leader.memberName}`
                              : "No active leader"}{" "}
                            •
                            {` ${group.currentMember}/${group.maxMember} members`}
                          </div>
                        </div>
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Card>

          {/* Timeline & Project Phases Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <CalendarOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Timeline & Project Phases
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define project phases and deadlines
                </p>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Project Duration
                </span>
              }
              required
              className="mb-6"
            >
              <Input.Group compact>
                <Form.Item
                  name={["timeline", "start"]}
                  noStyle
                  rules={[
                    { required: true, message: "Start date is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        // Start date should not be in the past
                        if (value.isBefore(moment().startOf("day"))) {
                          return Promise.reject(
                            new Error("Start date cannot be in the past")
                          );
                        }

                        // Start date should be before end date (if end date is selected)
                        const endDate = getFieldValue(["timeline", "end"]);
                        if (endDate && value.isAfter(endDate)) {
                          return Promise.reject(
                            new Error("Start date must be before end date")
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Start Date"
                    className="w-[calc(50%-8px)] mr-4 rounded-lg"
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                  />
                </Form.Item>
                <Form.Item
                  name={["timeline", "end"]}
                  noStyle
                  rules={[
                    { required: true, message: "End date is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        // End date should be after start date
                        const startDate = getFieldValue(["timeline", "start"]);
                        if (startDate && value.isBefore(startDate)) {
                          return Promise.reject(
                            new Error("End date must be after start date")
                          );
                        }

                        // Project should have reasonable duration - at least 30 days
                        if (startDate && value.diff(startDate, "days") < 30) {
                          return Promise.reject(
                            new Error(
                              "Project duration should be at least 30 days"
                            )
                          );
                        }

                        // Project should not be unreasonably long - no more than 3 years
                        if (
                          startDate &&
                          value.diff(startDate, "years", true) > 3
                        ) {
                          return Promise.reject(
                            new Error(
                              "Project duration should not exceed 3 years"
                            )
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="End Date"
                    className="w-[calc(50%-8px)] rounded-lg"
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue([
                        "timeline",
                        "start",
                      ]);
                      return (
                        (current && current < moment().startOf("day")) ||
                        (startDate && current && current < startDate)
                      );
                    }}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.List
              name="projectPhases"
              rules={[
                {
                  validator: async (_, phases) => {
                    if (!phases || phases.length < 1) {
                      return Promise.reject(
                        new Error("At least one project phase is required")
                      );
                    }

                    // Ensure phases have both start and end dates
                    for (let i = 0; i < phases.length; i++) {
                      const phase = phases[i];
                      if (!phase || !phase.startDate || !phase.endDate) {
                        return Promise.reject(
                          new Error(
                            `Phase ${i + 1} must have both start and end dates`
                          )
                        );
                      }

                      // Check phase start date is before end date - only if both exist
                      if (
                        phase.startDate &&
                        phase.endDate &&
                        phase.startDate.isAfter(phase.endDate)
                      ) {
                        return Promise.reject(
                          new Error(
                            `Phase ${
                              i + 1
                            } start date must be before its end date`
                          )
                        );
                      }
                    }

                    // Ensure phases don't overlap - with proper null checks
                    for (let i = 0; i < phases.length - 1; i++) {
                      const currentPhase = phases[i];
                      const nextPhase = phases[i + 1];

                      // Only check if both phases have the required dates
                      if (
                        currentPhase &&
                        currentPhase.endDate &&
                        nextPhase &&
                        nextPhase.startDate &&
                        currentPhase.endDate.isAfter(nextPhase.startDate)
                      ) {
                        return Promise.reject(
                          new Error(
                            `Phase ${i + 1} end date overlaps with Phase ${
                              i + 2
                            } start date`
                          )
                        );
                      }
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-gray-700 font-medium">
                        Project Phases
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Define key project phases and their deadlines
                      </div>
                    </div>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      className="border-[#F2722B] text-[#F2722B] hover:border-[#F2722B]/80 hover:text-[#F2722B]/80"
                    >
                      <div className="flex items-center">
                        <PlusOutlined className="mr-1" />
                        Add Phase
                      </div>
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F2722B]/10 mb-4">
                          <CalendarOutlined className="text-xl text-[#F2722B]" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          No project phases added
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by adding your first project phase
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.key}
                          className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-[#F2722B]/30 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#F2722B]/10 flex items-center justify-center mr-3">
                                <span className="text-sm font-semibold text-[#F2722B]">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-base font-medium text-gray-900">
                                Phase {index + 1}
                              </span>
                            </div>
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => remove(field.name)}
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <Form.Item
                              {...field}
                              name={[field.name, "title"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter project phase title",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Enter project phase title"
                                className="rounded-lg"
                              />
                            </Form.Item>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item
                                {...field}
                                name={[field.name, "startDate"]}
                                label="Start Date"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select start date",
                                  },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (!value) return Promise.resolve();

                                      // Check phase start date is within project duration
                                      const projectStart = getFieldValue([
                                        "timeline",
                                        "start",
                                      ]);
                                      const projectEnd = getFieldValue([
                                        "timeline",
                                        "end",
                                      ]);

                                      if (
                                        projectStart &&
                                        value &&
                                        value.isBefore(projectStart)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "Phase cannot start before project start date"
                                          )
                                        );
                                      }

                                      if (
                                        projectEnd &&
                                        value &&
                                        value.isAfter(projectEnd)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "Phase cannot start after project end date"
                                          )
                                        );
                                      }

                                      // Validate against phase end date
                                      const phaseEnd = getFieldValue([
                                        "projectPhases",
                                        field.name,
                                        "endDate",
                                      ]);
                                      if (
                                        phaseEnd &&
                                        value &&
                                        value.isAfter(phaseEnd)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "Start date must be before end date"
                                          )
                                        );
                                      }

                                      return Promise.resolve();
                                    },
                                  }),
                                ]}
                              >
                                <DatePicker
                                  placeholder="Select start date"
                                  className="w-full rounded-lg"
                                  disabledDate={(current) => {
                                    if (!current) return false;

                                    const projectStart = form.getFieldValue([
                                      "timeline",
                                      "start",
                                    ]);
                                    const projectEnd = form.getFieldValue([
                                      "timeline",
                                      "end",
                                    ]);

                                    // Get previous phase end date if it exists
                                    let previousPhaseEndDate = null;
                                    if (field.name > 0) {
                                      previousPhaseEndDate = form.getFieldValue(
                                        [
                                          "projectPhases",
                                          field.name - 1,
                                          "endDate",
                                        ]
                                      );
                                    }

                                    // Disable dates outside project timeline or before previous phase end
                                    return (
                                      current.isBefore(
                                        moment().startOf("day")
                                      ) || // No dates in the past
                                      (projectStart &&
                                        current.isBefore(projectStart)) || // No dates before project start
                                      (projectEnd &&
                                        current.isAfter(projectEnd)) || // No dates after project end
                                      (previousPhaseEndDate &&
                                        current.isBefore(previousPhaseEndDate)) // No dates before previous phase ends
                                    );
                                  }}
                                />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                name={[field.name, "endDate"]}
                                label="End Date"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select end date",
                                  },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (!value) return Promise.resolve();

                                      // Check phase end date is within project duration
                                      const projectStart = getFieldValue([
                                        "timeline",
                                        "start",
                                      ]);
                                      const projectEnd = getFieldValue([
                                        "timeline",
                                        "end",
                                      ]);

                                      if (
                                        projectStart &&
                                        value &&
                                        value.isBefore(projectStart)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "Phase cannot end before project start date"
                                          )
                                        );
                                      }

                                      if (
                                        projectEnd &&
                                        value &&
                                        value.isAfter(projectEnd)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "Phase cannot end after project end date"
                                          )
                                        );
                                      }

                                      // Validate against phase start date
                                      const phaseStart = getFieldValue([
                                        "projectPhases",
                                        field.name,
                                        "startDate",
                                      ]);
                                      if (
                                        phaseStart &&
                                        value &&
                                        value.isBefore(phaseStart)
                                      ) {
                                        return Promise.reject(
                                          new Error(
                                            "End date must be after start date"
                                          )
                                        );
                                      }

                                      return Promise.resolve();
                                    },
                                  }),
                                ]}
                              >
                                <DatePicker
                                  placeholder="Select end date"
                                  className="w-full rounded-lg"
                                  disabledDate={(current) => {
                                    if (!current) return false;

                                    const projectStart = form.getFieldValue([
                                      "timeline",
                                      "start",
                                    ]);
                                    const projectEnd = form.getFieldValue([
                                      "timeline",
                                      "end",
                                    ]);
                                    const phaseStart = form.getFieldValue([
                                      "projectPhases",
                                      field.name,
                                      "startDate",
                                    ]);

                                    // Get next phase start date if it exists
                                    let nextPhaseStartDate = null;
                                    if (field.name < fields.length - 1) {
                                      nextPhaseStartDate = form.getFieldValue([
                                        "projectPhases",
                                        field.name + 1,
                                        "startDate",
                                      ]);
                                    }

                                    // Disable dates outside project timeline, before phase start, or after next phase start
                                    return (
                                      current.isBefore(
                                        moment().startOf("day")
                                      ) || // No dates in the past
                                      (projectStart &&
                                        current.isBefore(projectStart)) || // No dates before project start
                                      (projectEnd &&
                                        current.isAfter(projectEnd)) || // No dates after project end
                                      (phaseStart &&
                                        current.isBefore(phaseStart)) || // No dates before phase start
                                      (nextPhaseStartDate &&
                                        current.isAfter(nextPhaseStartDate)) // No dates after next phase starts
                                    );
                                  }}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Form.ErrorList errors={errors} />
                </div>
              )}
            </Form.List>
          </Card>

          {/* Proposed Resources Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <DollarOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Proposed Resources
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  List all resources required for this research project
                </p>
              </div>
            </div>

            <Form.List
              name="proposedResources"
              rules={[
                {
                  validator: async (_, resources) => {
                    if (!resources || resources.length < 1) {
                      return Promise.reject(
                        new Error("At least one resource is required")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-gray-700 font-medium">
                        Resources Required
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Add equipment, materials, services and other resources
                        needed
                      </div>
                    </div>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      className="border-[#F2722B] text-[#F2722B] hover:border-[#F2722B]/80 hover:text-[#F2722B]/80"
                    >
                      <div className="flex items-center">
                        <PlusOutlined className="mr-1" />
                        Add Resource
                      </div>
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F2722B]/10 mb-4">
                          <DollarOutlined className="text-xl text-[#F2722B]" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          No resources added
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by adding the resources you need for this
                          project
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={`resource-${field.key}`}
                          className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-[#F2722B]/30 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#F2722B]/10 flex items-center justify-center mr-3">
                                <span className="text-sm font-semibold text-[#F2722B]">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-base font-medium text-gray-900">
                                Resource {index + 1}
                              </span>
                            </div>
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => remove(field.name)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                              {...field}
                              name={[field.name, "proposedResourceName"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter resource name",
                                },
                              ]}
                              label="Resource Name"
                            >
                              <Input
                                placeholder="Enter resource name"
                                className="rounded-lg"
                              />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, "proposedResourceType"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please select resource type",
                                },
                              ]}
                              label="Resource Type"
                            >
                              <Select
                                placeholder="Select resource type"
                                className="rounded-lg"
                              >
                                <Select.Option value={1}>Human</Select.Option>
                                <Select.Option value={2}>
                                  Equipment
                                </Select.Option>
                                <Select.Option value={3}>
                                  Software
                                </Select.Option>
                                <Select.Option value={4}>
                                  Document
                                </Select.Option>
                                <Select.Option value={5}>
                                  Material
                                </Select.Option>
                                <Select.Option value={6}>
                                  Personnel
                                </Select.Option>
                                <Select.Option value={7}>
                                  Facility
                                </Select.Option>
                                <Select.Option value={8}>Travel</Select.Option>
                                <Select.Option value={9}>
                                  Conference
                                </Select.Option>
                                <Select.Option value={10}>
                                  Journal
                                </Select.Option>
                                <Select.Option value={11}>
                                  Dataset
                                </Select.Option>
                                <Select.Option value={12}>Other</Select.Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, "proposedResourceQuantity"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter quantity",
                                },
                              ]}
                              label="Quantity"
                            >
                              <InputNumber
                                placeholder="Enter quantity"
                                min={1}
                                className="w-full rounded-lg"
                              />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, "proposedResourceCost"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter cost",
                                },
                              ]}
                              label="Cost (VND)"
                            >
                              <InputNumber
                                placeholder="Enter cost per unit"
                                min={0}
                                className="w-full rounded-lg"
                                formatter={(value) =>
                                  `₫ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/₫\s?|(,*)/g, "")
                                }
                              />
                            </Form.Item>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Form.ErrorList errors={errors} />
                </div>
              )}
            </Form.List>
          </Card>

          {/* Add a budget summary section after the Proposed Resources Card */}
          {!budgetStatus.valid && (
            <Alert
              type="warning"
              showIcon
              message="Budget allocation warning"
              description={
                <div>
                  <p>
                    Some resource allocations exceed the recommended budget
                    limits:
                  </p>
                  <ul className="list-disc ml-6 mt-2">
                    {Object.values(budgetStatus.validations || {}).map(
                      (validation, idx) => (
                        <li
                          key={`validation-${idx}-${validation.actual}`}
                          className="text-amber-700"
                        >
                          {validation.message} (
                          {formatCurrency(validation.actual)} &gt;{" "}
                          {formatCurrency(validation.limit)})
                        </li>
                      )
                    )}
                  </ul>
                </div>
              }
              className="mb-4"
            />
          )}

          {budgetStatus.categoryTotals &&
            Object.keys(budgetStatus.categoryTotals).length > 0 && (
              <Card
                className="shadow-md rounded-xl border-0 overflow-hidden"
                headStyle={{
                  borderBottom: "2px solid #F2722B20",
                  padding: "20px 24px",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center mb-6">
                  <DollarOutlined className="text-2xl text-[#F2722B] mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Budget Allocation Summary
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Overview of how your budget is allocated across categories
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Limit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Allocated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(budgetStatus.categoryTotals).map(
                        ([category, total], idx) => {
                          const budget = form.getFieldValue("budget") || 0;
                          const limit =
                            BUDGET_CATEGORY_LIMITS[category] * budget;
                          const isOverBudget = total > limit;
                          const percentage =
                            budget > 0
                              ? ((total / budget) * 100).toFixed(1)
                              : 0;

                          return (
                            <tr key={`budget-category-${category}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium">
                                  {getCategoryName(category)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {formatCurrency(limit)}{" "}
                                <span className="text-gray-500 text-xs">
                                  ({BUDGET_CATEGORY_LIMITS[category] * 100}%)
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {formatCurrency(total)}{" "}
                                <span className="text-gray-500 text-xs">
                                  ({percentage}%)
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isOverBudget ? (
                                  <Tag color="red">Exceeds Limit</Tag>
                                ) : (
                                  <Tag color="green">Within Limit</Tag>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

          {/* Additional Document */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <FileOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Additional Documents
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Upload supporting documents and files
                </p>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium text-base">
                  Supporting Documents <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="supporting_files"
              extra="Upload any relevant documents to support your research proposal"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one supporting document!",
                },
              ]}
              getValueFromEvent={(e) => e && e.fileList}
            >
              <Upload.Dragger
                fileList={fileList}
                onChange={handleFileChange}
                multiple
                className="rounded-lg"
                beforeUpload={() => false} // Prevent auto-upload
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-[#F2722B]" />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
                <p className="ant-upload-hint">
                  Support for single or multiple file uploads (PDF, DOCX, etc.)
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item name="submission_date" hidden>
              <Input type="hidden" value={new Date().toISOString()} />
            </Form.Item>

            <Form.Item name="status" hidden>
              <Input type="hidden" value="pending" />
            </Form.Item>
          </Card>

          {/* Enhanced Action Buttons */}
          <div className="flex justify-end space-x-4 mt-12">
            <Button
              icon={<SaveOutlined />}
              className="rounded-lg border-2 border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E] px-6 h-11 flex items-center"
            >
              Save as Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none px-6 h-11 flex items-center"
              loading={isSubmitting || isUploading}
              disabled={
                isLoadingGroups ||
                isLoadingDepartments ||
                isSubmitting ||
                isUploading
              }
            >
              Submit Proposal
            </Button>
          </div>
        </Form>
      </div>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        footer={null}
        closable={false}
        width={600}
        className="registration-success-modal"
        centered
      >
        <Result
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          status="success"
          title={
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                Research Project Registered Successfully!
              </div>
              <div className="text-base text-gray-500">
                Project ID: {registeredProjectId}
              </div>
            </div>
          }
          subTitle={
            <div className="mt-3 text-center">
              <p className="text-gray-600">
                Your research project{" "}
                <span className="font-semibold">"{registeredProjectName}"</span>{" "}
                has been submitted for review. You will be notified when it's
                approved.
              </p>
            </div>
          }
          extra={[
            <div key="action-buttons" className="flex justify-center space-x-4">
              <Button
                key="view-project"
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => {
                  setIsSuccessModalVisible(false);
                  if (registeredProjectId) {
                    navigate(`/project-request/${registeredProjectId}`);
                  }
                }}
                className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none px-6 h-11 flex items-center"
              >
                View Project Request
              </Button>
            </div>,
          ]}
        />
      </Modal>
    </div>
  );
};

export default RegisterResearch;
