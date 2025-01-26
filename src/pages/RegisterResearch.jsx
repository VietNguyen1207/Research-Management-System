import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Divider,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  SendOutlined,
  UserOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const RegisterResearch = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [fileList, setFileList] = useState([]);

  // Mock data - replace with API calls
  const lecturers = [
    { id: 1, name: "Dr. Emily Smith" },
    { id: 2, name: "Prof. John Doe" },
    { id: 3, name: "Dr. Sarah Johnson" },
  ];

  const departments = [
    { id: 1, name: "Computer Science" },
    { id: 2, name: "Information Technology" },
    { id: 3, name: "Software Engineering" },
  ];

  const categories = [
    { id: 1, name: "AI & Machine Learning" },
    { id: 2, name: "Data Science" },
    { id: 3, name: "Cybersecurity" },
  ];

  // Add mock data for groups (replace with API call later)
  const availableGroups = [
    {
      id: 1,
      name: "AI Research Group",
      members: [
        { name: "Dr. Emily Smith", role: "Leader" },
        { name: "John Doe", role: "Member" },
      ],
    },
    {
      id: 2,
      name: "Machine Learning Lab",
      members: [
        { name: "Prof. Sarah Johnson", role: "Leader" },
        { name: "Alice Wong", role: "Member" },
      ],
    },
  ];

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Research project submitted successfully!");
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Keep only the latest file
    setFileList(fileList);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Register New Research
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide detailed information about your research project
          </p>
        </div>

        <Form
          form={form}
          name="register_research"
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md"
          initialValues={{
            department_id: user?.department_id,
            status: "pending",
          }}
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Project Title"
              name="title"
              rules={[
                { required: true, message: "Please input project title!" },
              ]}
            >
              <Input
                prefix={<FileTextOutlined className="text-gray-400" />}
                placeholder="Enter the project title"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Project Description"
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

          <Divider>Research Details</Divider>

          <Form.Item
            label="Objectives"
            name="objectives"
            rules={[
              { required: true, message: "Please input research objectives!" },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Enter research objectives"
              className="w-full"
              tokenSeparators={[","]}
            />
          </Form.Item>

          <Form.Item
            label="Expected Outcomes"
            name="expectedOutcomes"
            rules={[
              { required: true, message: "Please describe expected outcomes!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe the expected outcomes and impact of your research"
            />
          </Form.Item>

          <Form.Item
            label="Required Datasets"
            name="datasets"
            extra="Optional: List any specific datasets needed for the research"
          >
            <Select
              mode="tags"
              placeholder="Enter required datasets"
              className="w-full"
              tokenSeparators={[","]}
            />
          </Form.Item>

          <Divider />

          {/* Supervisor and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Supervisor"
              name="lecturer_id"
              rules={[
                { required: true, message: "Please select a supervisor!" },
              ]}
            >
              <Select
                placeholder="Select a supervisor"
                className="rounded-lg"
                prefix={<UserOutlined />}
              >
                {lecturers.map((lecturer) => (
                  <Select.Option key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Department"
              name="department_id"
              rules={[
                { required: true, message: "Please select a department!" },
              ]}
            >
              <Select
                placeholder="Select a department"
                className="rounded-lg"
                prefix={<BankOutlined />}
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Divider />

          {/* Timeline and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Project Timeline" required className="mb-0">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="start_date"
                  rules={[{ required: true, message: "Select start date!" }]}
                >
                  <DatePicker
                    placeholder="Start Date"
                    className="w-full rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  name="end_date"
                  rules={[{ required: true, message: "Select end date!" }]}
                >
                  <DatePicker
                    placeholder="End Date"
                    className="w-full rounded-lg"
                  />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label="Budget (VND)"
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

          <Divider />

          {/* Category and Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Category"
              name="category_ids"
              rules={[{ required: true, message: "Please select categories!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select categories"
                className="rounded-lg"
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Research Group */}
            <Form.Item
              label="Research Group"
              name="group_id"
              rules={[
                { required: true, message: "Please select a research group!" },
              ]}
              className="col-span-2"
            >
              <Select
                placeholder="Select a research group"
                optionLabelProp="label"
                className="w-full"
              >
                {availableGroups.map((group) => (
                  <Select.Option
                    key={group.id}
                    value={group.id}
                    label={
                      <div className="flex items-center">
                        <TeamOutlined className="mr-2" />
                        {group.name}
                      </div>
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{group.name}</span>
                      <span className="text-xs text-gray-500">
                        Members: {group.members.map((m) => m.name).join(", ")}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Supporting Documents"
              name="document"
              rules={[
                { required: true, message: "Please upload project documents!" },
              ]}
            >
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} className="rounded-lg w-full">
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Hidden Status Field */}
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              icon={<SaveOutlined />}
              className="rounded-lg border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
            >
              Save as Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
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
