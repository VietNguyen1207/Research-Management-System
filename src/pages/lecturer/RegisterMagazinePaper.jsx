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
  Space,
  Radio,
  Collapse,
  InputNumber,
  Card,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  SendOutlined,
  UserOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CaretRightOutlined,
  DollarOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  ShopOutlined,
  GlobalOutlined,
  InboxOutlined,
  AimOutlined,
  FileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import React from "react";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RegisterJournalPaper = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [authors, setAuthors] = useState([
    { name: "", role: "", email: "", phone: "" },
  ]);
  const [otherIssueSelected, setOtherIssueSelected] = useState(false);

  // Mock data - replace with API calls
  const existingProjects = [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ];

  const responsiblePersons = [
    { id: 1, name: "Dr. Emily Smith" },
    { id: 2, name: "Prof. John Doe" },
    { id: 3, name: "Research Team A" },
  ];

  const researchFields = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Artificial Intelligence",
  ];

  const authorRoles = [
    "Lead Author",
    "Co-author",
    "Contributing Author",
    "Corresponding Author",
  ];

  const issueTypes = [
    "Incomplete Research",
    "Missing Data",
    "Pending Review Feedback",
    "Budget Constraints",
    "Other",
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
    message.success("Case study submitted successfully!");
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5); // Keep last 5 files
    setFileList(fileList);
  };

  const removeAuthor = (index) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);

    // Update form fields
    const currentAuthors = form.getFieldValue("authors") || [];
    const updatedAuthors = currentAuthors.filter((_, i) => i !== index);
    form.setFieldValue("authors", updatedAuthors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Register Case Study
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please provide detailed information about your case study
          </p>
        </div>

        <Form
          form={form}
          name="register_case_study"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-8"
          initialValues={{
            submission_date: dayjs(),
            status: "Draft",
            priority_level: "Medium",
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
                  Enter the fundamental details of your case study
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Title
                  </span>
                }
                name="title"
                rules={[{ required: true, message: "Please input the title!" }]}
              >
                <Input
                  prefix={<FileTextOutlined className="text-gray-400" />}
                  placeholder="Enter the working title of the paper"
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
              >
                <TextArea
                  placeholder="Provide a brief overview of the paper"
                  rows={4}
                  className="rounded-lg"
                />
              </Form.Item>
            </div>
          </Card>

          {/* Company Profile Collapsible Card */}
          <Collapse
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="text-[#F2722B]"
              />
            )}
            className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
          >
            <Collapse.Panel
              header={
                <div className="flex items-center">
                  <BankOutlined className="text-xl text-[#F2722B] mr-3" />
                  <div className="">
                    <h3 className="flex items-start text-lg font-medium text-gray-900">
                      Company Profile
                    </h3>
                    <p className="text-sm text-gray-500">
                      Information about the company involved (Optional)
                    </p>
                  </div>
                </div>
              }
              key="1"
              className="bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Company Name
                    </span>
                  }
                  name={["companyProfile", "name"]}
                >
                  <Input
                    prefix={<BankOutlined className="text-gray-400" />}
                    placeholder="Enter company name"
                    className="rounded-lg py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Industry
                    </span>
                  }
                  name={["companyProfile", "industry"]}
                >
                  <Input
                    prefix={<ShopOutlined className="text-gray-400" />}
                    placeholder="Enter industry type"
                    className="rounded-lg py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Company Size
                    </span>
                  }
                  name={["companyProfile", "size"]}
                >
                  <Select
                    placeholder="Select company size"
                    className="rounded-lg"
                  >
                    <Option value="1-50 employees">1-50 employees</Option>
                    <Option value="51-200 employees">51-200 employees</Option>
                    <Option value="201-500 employees">201-500 employees</Option>
                    <Option value="500+ employees">500+ employees</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Company Website
                    </span>
                  }
                  name={["companyProfile", "website"]}
                >
                  <Input
                    prefix={<GlobalOutlined className="text-gray-400" />}
                    placeholder="Enter company website"
                    className="rounded-lg py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Contact Person
                    </span>
                  }
                  name={["companyProfile", "contactPerson"]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Name of company contact person"
                    className="rounded-lg py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium text-base">
                      Contact Email
                    </span>
                  }
                  name={["companyProfile", "contactEmail"]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email of company contact person"
                    className="rounded-lg py-2.5"
                  />
                </Form.Item>
              </div>
            </Collapse.Panel>
          </Collapse>

          {/* Study Scope Card */}
          <Card
            className="shadow-md rounded-xl border-0 overflow-hidden"
            headStyle={{
              borderBottom: "2px solid #F2722B20",
              padding: "20px 24px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex items-center mb-6">
              <AimOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Study Scope
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define the scope and focus areas of your case study
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label="Primary Focus"
                name={["studyScope", "primary"]}
                rules={[
                  { required: true, message: "Please input primary focus!" },
                ]}
              >
                <Input placeholder="Enter primary focus of the case study" />
              </Form.Item>
              <Form.Item
                label="Secondary Areas"
                name={["studyScope", "secondary"]}
                rules={[
                  { required: true, message: "Please input secondary areas!" },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Enter secondary areas of focus"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Data Collection Methods"
                name="dataCollectionMethods"
                rules={[
                  {
                    required: true,
                    message: "Please select data collection methods!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select data collection methods"
                  className="w-full"
                >
                  <Option value="On-site observations">
                    On-site observations
                  </Option>
                  <Option value="Employee interviews">
                    Employee interviews
                  </Option>
                  <Option value="Process analysis">Process analysis</Option>
                  <Option value="Financial data review">
                    Financial data review
                  </Option>
                  <Option value="Document analysis">Document analysis</Option>
                  <Option value="Surveys">Surveys</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Expected Deliverables"
                name="expectedDeliverables"
                rules={[
                  {
                    required: true,
                    message: "Please input expected deliverables!",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Enter expected deliverables"
                  className="w-full"
                  tokenSeparators={[","]}
                />
              </Form.Item>
              <Form.Item
                label="Detailed Description of the Issue"
                name="issue_description"
                rules={[
                  { required: true, message: "Please describe the issue!" },
                ]}
              >
                <TextArea placeholder="Describe the issue in detail" rows={4} />
              </Form.Item>
              <Form.Item label="Proposed Solutions" name="proposed_solutions">
                <TextArea
                  placeholder="Provide suggestions for resolving the issue"
                  rows={4}
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
                <h3 className=" flex items-start text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Details about the project
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Case Study Lead
                  </span>
                }
                name="case_lead_id"
                rules={[
                  {
                    required: true,
                    message: "Please select a case study lead!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a case study lead"
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
                  <span className="text-gray-700 font-medium">
                    Study Category
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

          {/* Authors Information Card */}
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
                  Authors Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Details about the authors involved in the case study
                </p>
              </div>
            </div>

            {authors.map((author, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Author {index + 1}
                  </h4>
                  {index > 0 && (
                    <Button
                      danger
                      type="text"
                      onClick={() => removeAuthor(index)}
                      icon={<DeleteOutlined />}
                      className="hover:bg-red-50"
                    >
                      Remove Author
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">Name</span>
                    }
                    name={["authors", index, "name"]}
                    rules={[{ required: true, message: "Name is required!" }]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="Full name"
                      className="rounded-lg py-2.5"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">Role</span>
                    }
                    name={["authors", index, "role"]}
                    rules={[{ required: true, message: "Role is required!" }]}
                  >
                    <Select
                      placeholder="Select author role"
                      className="rounded-lg"
                    >
                      {authorRoles.map((role) => (
                        <Option key={role} value={role}>
                          {role}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">Email</span>
                    }
                    name={["authors", index, "email"]}
                    rules={[
                      { required: true, message: "Email is required!" },
                      { type: "email", message: "Invalid email!" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Email address"
                      className="rounded-lg py-2.5"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">Phone</span>
                    }
                    name={["authors", index, "phone"]}
                    rules={[{ required: true, message: "Phone is required!" }]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      placeholder="Phone number"
                      className="rounded-lg py-2.5"
                    />
                  </Form.Item>
                </div>
              </div>
            ))}

            <Button
              type="dashed"
              onClick={() =>
                setAuthors([
                  ...authors,
                  { name: "", role: "", email: "", phone: "" },
                ])
              }
              className="w-full rounded-lg border-[#F2722B] text-[#F2722B] hover:border-[#F2722B]/80 hover:text-[#F2722B]/80"
            >
              <PlusOutlined /> Add Author
            </Button>
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
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Timeline & Milestones
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define the timeline and milestones for your project
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

          {/* Documents Card */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Supporting Files
                  </span>
                }
                name="supporting_files"
              >
                <Upload.Dragger
                  fileList={fileList}
                  onChange={handleFileChange}
                  multiple
                  className="rounded-lg"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-[#F2722B]" />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for single or bulk upload
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Associated Documents
                  </span>
                }
                name="associated_documents"
              >
                <Upload.Dragger
                  fileList={fileList}
                  onChange={handleFileChange}
                  multiple
                  className="rounded-lg"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-[#F2722B]" />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for single or bulk upload
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </div>
          </Card>

          {/* Enhanced Action Buttons */}
          <div className="flex justify-end space-x-4 mt-12">
            <Button
              icon={<SaveOutlined />}
              className="rounded-lg border-2 border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E] px-6 h-11 flex items-center"
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none px-6 h-11 flex items-center"
            >
              Submit Case Study
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterJournalPaper;
