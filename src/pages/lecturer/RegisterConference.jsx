import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Divider,
  InputNumber,
  Space,
  Collapse,
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
  MailOutlined,
  EnvironmentOutlined,
  BookOutlined,
  AimOutlined,
  ExperimentOutlined,
  CheckOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  PhoneOutlined,
  CalendarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import React from "react";

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const RegisterConference = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [authors, setAuthors] = useState([
    { name: "", email: "", affiliation: "" },
  ]);

  // Mock data - replace with API calls
  const researchFields = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Artificial Intelligence",
  ];

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

  const reviewers = [
    { id: 1, name: "Dr. Emily Smith" },
    { id: 2, name: "Prof. John Doe" },
    { id: 3, name: "Dr. Sarah Johnson" },
  ];

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
    message.success("Conference paper submitted successfully!");
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Register Conference Paper
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please provide detailed information about your conference paper
          </p>
        </div>

        <Form
          form={form}
          name="register_conference"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-8"
        >
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the fundamental details of your conference paper
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Paper Title
                  </span>
                }
                name="title"
                rules={[
                  { required: true, message: "Please input paper title!" },
                ]}
              >
                <Input
                  prefix={<FileTextOutlined className="text-gray-400" />}
                  placeholder="Enter the full title of the paper"
                  className="rounded-lg py-2.5"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Abstract
                  </span>
                }
                name="abstract"
                rules={[{ required: true, message: "Please input abstract!" }]}
              >
                <TextArea
                  placeholder="Provide a concise summary of the paper (250-300 words)"
                  rows={4}
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Purpose of the Paper
                    </span>
                  }
                  name="purpose"
                  rules={[{ required: true, message: "Purpose is required!" }]}
                >
                  <TextArea
                    prefix={<AimOutlined />}
                    placeholder="Explain the goal of your research"
                    rows={3}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Methodology
                    </span>
                  }
                  name="methodology"
                  rules={[
                    { required: true, message: "Methodology is required!" },
                  ]}
                >
                  <TextArea
                    prefix={<ExperimentOutlined />}
                    placeholder="Describe your research approach"
                    rows={3}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Expected Outcomes
                    </span>
                  }
                  name="expected_outcomes"
                  rules={[
                    {
                      required: true,
                      message: "Expected outcomes are required!",
                    },
                  ]}
                >
                  <TextArea
                    prefix={<CheckOutlined />}
                    placeholder="Describe anticipated results"
                    rows={3}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Keywords
                    </span>
                  }
                  name="keywords"
                  rules={[
                    { required: true, message: "Please input keywords!" },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter keywords (e.g., Artificial Intelligence, Data Science)"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>

          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <BookOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Conference Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Provide information about the conference venue and
                  presentation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Conference Location
                  </span>
                }
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Please input conference location!",
                  },
                ]}
              >
                <Input
                  prefix={<EnvironmentOutlined className="text-gray-400" />}
                  placeholder="Enter conference location"
                  className="rounded-lg py-2.5"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Presentation Type
                  </span>
                }
                name="presentationType"
                rules={[
                  {
                    required: true,
                    message: "Please select presentation type!",
                  },
                ]}
              >
                <Select
                  placeholder="Select presentation type"
                  className="rounded-lg"
                >
                  <Option value="Oral Presentation">Oral Presentation</Option>
                  <Option value="Poster Presentation">
                    Poster Presentation
                  </Option>
                  <Option value="Workshop">Workshop</Option>
                  <Option value="Panel Discussion">Panel Discussion</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Publishing Journal
                  </span>
                }
                name="publishingJournal"
                rules={[
                  {
                    required: true,
                    message: "Please input publishing journal!",
                  },
                ]}
                className="md:col-span-2"
              >
                <Input
                  prefix={<BookOutlined className="text-gray-400" />}
                  placeholder="Enter target publishing journal"
                  className="rounded-lg py-2.5"
                />
              </Form.Item>
            </div>
          </Card>

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
                <h3 className="text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Provide information about the project and research team
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Conference Lead
                  </span>
                }
                name="conference_lead_id"
                rules={[
                  {
                    required: true,
                    message: "Please select a conference lead!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a conference lead"
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
                  <span className="text-gray-700 font-medium text-base">
                    Research Team
                  </span>
                }
                name="team_id"
                rules={[
                  { required: true, message: "Please select a research team!" },
                ]}
              >
                <Select
                  placeholder="Select a research team"
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
                  <span className="text-gray-700 font-medium text-base">
                    Conference Category
                  </span>
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
                  <span className="text-gray-700 font-medium text-base">
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
                  Define key milestones and their deadlines
                </p>
              </div>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium text-base">
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
                      <span className="text-gray-700 font-medium text-base">
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

          <Divider>Additional Information</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Supporting Documents"
              name="documents"
              rules={[
                {
                  required: true,
                  message: "Please upload required documents!",
                },
              ]}
            >
              <Upload fileList={fileList} onChange={handleFileChange} multiple>
                <Button icon={<UploadOutlined />}>Upload Files</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Assigned Reviewer(s)"
              name="reviewers"
              rules={[
                { required: true, message: "Please select reviewer(s)!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select reviewers"
                className="w-full"
              >
                {reviewers.map((reviewer) => (
                  <Select.Option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="submission_date" hidden>
            <Input type="hidden" value={new Date().toISOString()} />
          </Form.Item>

          <Form.Item name="status" hidden>
            <Input type="hidden" value="pending" />
          </Form.Item>

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
              Submit Conference Paper
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterConference;
