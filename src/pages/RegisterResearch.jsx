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
  Card,
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
  MinusCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
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
            department_id: user?.department_id,
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
                  <span className="text-gray-700 font-medium">Objectives</span>
                }
                name="objectives"
                rules={[
                  {
                    required: true,
                    message: "Please input research objectives!",
                  },
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
                label={
                  <span className="text-gray-700 font-medium">
                    Required Datasets
                  </span>
                }
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
              <TeamOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the project details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Supervisor</span>
                }
                name="lecturer_id"
                rules={[
                  { required: true, message: "Please select a supervisor!" },
                ]}
              >
                <Select
                  placeholder="Select a supervisor"
                  className="rounded-lg"
                  suffixIcon={<UserOutlined className="text-gray-400" />}
                >
                  {lecturers.map((lecturer) => (
                    <Select.Option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

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
                  placeholder="Select a research group"
                  className="rounded-lg"
                  suffixIcon={<TeamOutlined className="text-gray-400" />}
                >
                  {availableGroups.map((group) => (
                    <Select.Option key={group.id} value={group.id}>
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-gray-500">
                          Leader:{" "}
                          {group.members.find((m) => m.role === "Leader")?.name}
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Category</span>
                }
                name="category_ids"
                rules={[
                  { required: true, message: "Please select categories!" },
                ]}
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

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Department</span>
                }
                name="department_id"
                rules={[
                  { required: true, message: "Please select a department!" },
                ]}
              >
                <Select
                  placeholder="Select a department"
                  className="rounded-lg"
                  suffixIcon={<BankOutlined className="text-gray-400" />}
                >
                  {departments.map((dept) => (
                    <Select.Option key={dept.id} value={dept.id}>
                      {dept.name}
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
                className="md:col-span-2"
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <Form.Item
                              {...field}
                              name={[field.name, "deadline"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please select deadline",
                                },
                              ]}
                            >
                              <DatePicker
                                placeholder="Select deadline"
                                className="w-full rounded-lg"
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
