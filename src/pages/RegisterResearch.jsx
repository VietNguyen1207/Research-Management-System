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
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useGetStudentGroupsQuery } from "../features/group/groupApiSlice";
import { useGetDepartmentsQuery } from "../features/department/departmentApiSlice";
import {
  useRegisterResearchProjectMutation,
  useUploadProjectDocumentMutation,
} from "../features/project/projectApiSlice";
import moment from "moment";

const { TextArea } = Input;

const RegisterResearch = () => {
  const [form] = Form.useForm();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const [fileList, setFileList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [projectId, setProjectId] = useState(null);

  // Fetch departments data
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();

  // Fetch student groups for the current user
  const {
    data: userGroups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useGetStudentGroupsQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });

  // Register research project mutation
  const [registerProject, { isLoading: isSubmitting }] =
    useRegisterResearchProjectMutation();

  // Add upload document mutation
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadProjectDocumentMutation();

  const onFinish = async (values) => {
    try {
      // Format dates for API
      const formatDate = (date) => {
        return date ? moment(date).format("YYYY-MM-DD") : null;
      };

      // Transform milestones to match API requirements
      const transformedMilestones = values.milestones.map((milestone) => ({
        title: milestone.title,
        startDate: formatDate(milestone.startDate || values.timeline.start),
        endDate: formatDate(milestone.endDate || values.timeline.end),
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
        milestones: transformedMilestones,
      };

      // Step 1: Register the project first
      const response = await registerProject(projectData).unwrap();

      // Extract project ID from response message using regex
      const projectIdMatch = response.message?.match(/Project ID: (\d+)/);
      const projectId = projectIdMatch ? projectIdMatch[1] : null;

      console.log("Project created successfully with ID:", projectId);

      // Step 2: If we have files and a valid project ID, upload the documents
      if (fileList.length > 0 && projectId) {
        try {
          // Function to handle document uploads
          const uploadProjectDocuments = async (projectId, files) => {
            try {
              // The API might only accept one file at a time
              const file = files[0]; // Take only the first file

              if (!file || !file.originFileObj) {
                message.error("Invalid file selected");
                return;
              }

              // Create a FormData object
              const formData = new FormData();

              // Use the correct field name 'documentFile'
              formData.append("documentFile", file.originFileObj);

              // Call the upload API
              await uploadDocument({ projectId, formData }).unwrap();
              message.success(
                "Research project registered and document uploaded successfully!"
              );
            } catch (uploadError) {
              console.error("Error uploading documents:", uploadError);
              message.warning(
                "Project was created successfully, but document upload failed. You can upload documents later."
              );
            }
          };

          await uploadProjectDocuments(projectId, fileList);
        } catch (uploadError) {
          console.error("Error uploading documents:", uploadError);
          message.warning(
            "Project was created successfully, but document upload failed. You can upload documents later."
          );
        }
      } else {
        message.success("Research project registered successfully!");
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

        <Form
          form={form}
          name="register_research"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-8"
          initialValues={{
            type: "research",
            status: "pending",
          }}
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
                notFoundContent={
                  isLoadingGroups ? (
                    <Spin size="small" />
                  ) : userGroups?.length === 0 ? (
                    <div className="py-2 px-3 text-gray-500">
                      No research groups available. Please create a group first.
                    </div>
                  ) : null
                }
              >
                {userGroups?.map((group) => {
                  const leader = getGroupLeader(group.members);
                  return (
                    <Select.Option key={group.groupId} value={group.groupId}>
                      <div>
                        <div className="font-medium">{group.groupName}</div>
                        <div className="text-xs text-gray-500">
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

          {/* Timeline & Milestones Card */}
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
                  Timeline & Milestones
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define project milestones and deadlines
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
                  ]}
                >
                  <DatePicker
                    placeholder="Start Date"
                    className="w-[calc(50%-8px)] mr-4 rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  name={["timeline", "end"]}
                  noStyle
                  rules={[{ required: true, message: "End date is required" }]}
                >
                  <DatePicker
                    placeholder="End Date"
                    className="w-[calc(50%-8px)] rounded-lg"
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.List
              name="milestones"
              rules={[
                {
                  validator: async (_, milestones) => {
                    if (!milestones || milestones.length < 1) {
                      return Promise.reject(
                        new Error("At least one milestone is required")
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
                        Project Milestones
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Define key milestones and their deadlines
                      </div>
                    </div>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      className="border-[#F2722B] text-[#F2722B] hover:border-[#F2722B]/80 hover:text-[#F2722B]/80"
                    >
                      <div className="flex items-center">
                        <PlusOutlined className="mr-1" />
                        Add Milestone
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
                          No milestones added
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by adding your first project milestone
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
                                Milestone {index + 1}
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
                                  message: "Please enter milestone title",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Enter milestone title"
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
                                ]}
                              >
                                <DatePicker
                                  placeholder="Select start date"
                                  className="w-full rounded-lg"
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
                                ]}
                              >
                                <DatePicker
                                  placeholder="Select end date"
                                  className="w-full rounded-lg"
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
                  Supporting Documents
                </span>
              }
              name="supporting_files"
              extra="Upload any relevant documents to support your research proposal"
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
    </div>
  );
};

export default RegisterResearch;
