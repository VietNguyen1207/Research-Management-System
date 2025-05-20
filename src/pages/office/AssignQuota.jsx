import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Card,
  Typography,
  message,
  Spin,
  Divider,
  Row,
  Col,
  Alert,
  Space,
  Input,
  Breadcrumb,
} from "antd";
import {
  BankOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../features/api/apiSlice";
import { useCreateQuotaMutation } from "../../features/quota/quotaApiSlice";
import { useGetDepartmentsQuery } from "../../features/department/departmentApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const AssignQuota = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments data from API
  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
    error: departmentsError,
  } = useGetDepartmentsQuery();

  // Create quota mutation
  const [createQuota, { isLoading: isCreating }] = useCreateQuotaMutation();

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Prepare data for quota assignment
      const quotaData = {
        departmentId: values.departmentId,
        allocatedBudget: values.totalBudget,
        numProjects: values.numProjects,
        quotaYear: values.fiscalYear,
        numberConference: values.numberConference,
        numberPaper: values.numberJournals, // Send as numberPaper to match backend
      };

      // Call the create quota mutation
      const response = await createQuota(quotaData).unwrap();

      // Success message and redirect
      message.success("Quota successfully assigned to department");

      // Reset form and redirect
      form.resetFields();
      navigate("/quota-management");
    } catch (error) {
      message.error(
        "Failed to assign quota: " +
          (error.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleDepartmentChange = (value) => {
    const dept = departmentsData?.find((d) => d.departmentId === value);
    setSelectedDepartment(dept);
  };

  if (isDepartmentsLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spin size="large" tip="Loading departments..." />
      </div>
    );
  }

  if (isDepartmentsError) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Error loading departments"
          description={
            departmentsError?.data?.message ||
            "Failed to load department data. Please try again later."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a onClick={() => navigate("/quota-management")}>
                <BankOutlined /> Departments
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-[#F2722B]">
                <DollarOutlined /> Assign Quota
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/quota-management")}
            className="mb-4"
          >
            Back to Departments
          </Button>
          <Title
            level={2}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500]"
          >
            Assign Quota to Department
          </Title>
          <Text className="text-gray-600">
            Allocate budget and project quotas to a department for the fiscal
            year
          </Text>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md border-0">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              initialValues={{
                fiscalYear: new Date().getFullYear(),
                numProjects: 5,
                numberConference: 3,
                numberJournals: 3,
              }}
            >
              <Form.Item
                label="Department"
                name="departmentId"
                rules={[
                  {
                    required: true,
                    message: "Please select a department",
                  },
                ]}
              >
                <Select
                  placeholder="Select a department"
                  onChange={handleDepartmentChange}
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                >
                  {departmentsData?.map((dept) => (
                    <Option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Fiscal Year"
                name="fiscalYear"
                rules={[
                  {
                    required: true,
                    message: "Please enter the fiscal year",
                  },
                ]}
              >
                <InputNumber
                  min={2020}
                  max={2100}
                  className="w-full"
                  formatter={(value) => `${value}`}
                />
              </Form.Item>

              <Divider>Quota Allocation</Divider>

              <Form.Item
                label="Number of Projects"
                name="numProjects"
                rules={[
                  {
                    required: true,
                    message: "Please enter the number of projects",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  className="w-full"
                  addonAfter="projects"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <VideoCameraOutlined className="mr-1" /> Number of
                    Conferences
                  </span>
                }
                name="numberConference"
                rules={[
                  {
                    required: true,
                    message: "Please enter the number of conferences",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={50}
                  className="w-full"
                  addonAfter="conferences"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <FileTextOutlined className="mr-1" /> Number of Journals
                  </span>
                }
                name="numberJournals" // Named "numberJournals" in form but will be sent as "numberPaper"
                rules={[
                  {
                    required: true,
                    message: "Please enter the number of journals",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={50}
                  className="w-full"
                  addonAfter="journals"
                />
              </Form.Item>

              <Form.Item
                label="Total Budget Allocation"
                name="totalBudget"
                rules={[
                  {
                    required: true,
                    message: "Please enter the total budget",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1000000}
                  className="w-full"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="VND"
                />
              </Form.Item>

              <Form.Item>
                <Space className="w-full justify-end">
                  <Button onClick={() => navigate("/quota-management")}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isCreating}
                    className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                  >
                    Assign Quota
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignQuota;
