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
  Tag,
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
  FileOutlined,
  PlusOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  GlobalOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
// import React from "react";

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const RegisterPaper = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [authors, setAuthors] = useState([
    { name: "", email: "", affiliation: "" },
  ]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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
    // Computer Science Department (id: 1)
    { id: 1, name: "AI & Machine Learning", departmentId: 1 },
    { id: 2, name: "Data Science", departmentId: 1 },
    { id: 3, name: "Computer Vision", departmentId: 1 },
    { id: 4, name: "Natural Language Processing", departmentId: 1 },

    // Information Technology Department (id: 2)
    { id: 5, name: "Cybersecurity", departmentId: 2 },
    { id: 6, name: "Network Systems", departmentId: 2 },
    { id: 7, name: "Cloud Computing", departmentId: 2 },
    { id: 8, name: "IoT Systems", departmentId: 2 },

    // Software Engineering Department (id: 3)
    { id: 9, name: "Software Architecture", departmentId: 3 },
    { id: 10, name: "DevOps", departmentId: 3 },
    { id: 11, name: "Mobile Development", departmentId: 3 },
    { id: 12, name: "Web Technologies", departmentId: 3 },
  ];

  const paper_type = [
    { id: 1, name: "Conference" },
    { id: 2, name: "Journal" },
  ];

  const authorRoles = [
    "Lead Author",
    "Co-author",
    "Contributing Author",
    "Corresponding Author",
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

  // Add this constant for status options
  const publisherStatuses = [
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Paper submitted successfully!");
  };

  const removeAuthor = (index) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);

    // Update form fields
    const currentAuthors = form.getFieldValue("authors") || [];
    const updatedAuthors = currentAuthors.filter((_, i) => i !== index);
    form.setFieldValue("authors", updatedAuthors);
  };

  // const handleFileChange = (info) => {
  //   let fileList = [...info.fileList];
  //   fileList = fileList.slice(-1);
  //   setFileList(fileList);
  // };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    form.setFieldsValue({ category_ids: [] }); // Clear selected categories

    // Filter categories based on selected department
    const departmentCategories = categories.filter(
      (cat) => cat.departmentId === departmentId
    );
    setAvailableCategories(departmentCategories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Register New Paper
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please provide detailed information about your paper
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
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the fundamental details of your paper
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

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Publisher
                  </span>
                }
                name="publisher"
                rules={[
                  {
                    required: true,
                    message: "Please input publisher you submitted to!",
                  },
                ]}
              >
                <Input
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  placeholder="Enter publisher name"
                  className="rounded-lg py-2.5"
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
              <ProjectOutlined className="text-2xl text-[#F2722B] mr-3" />
              <div>
                <h3 className="flex items-start text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Specify the project details for your paper
                </p>
              </div>
            </div>

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
                  placeholder="Select a department"
                  className="rounded-lg"
                  suffixIcon={<BankOutlined className="text-gray-400" />}
                  onChange={handleDepartmentChange}
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
                    Category
                  </span>
                }
                name="category_ids"
                rules={[
                  { required: true, message: "Please select categories!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={
                    selectedDepartment
                      ? "Select categories"
                      : "Please select a department first"
                  }
                  className="rounded-lg"
                  disabled={!selectedDepartment}
                >
                  {availableCategories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Paper Type
                  </span>
                }
                name="paperType_ids"
                rules={[
                  {
                    required: true,
                    message: "Please select type of your paper!",
                  },
                ]}
              >
                <Select placeholder="Select paper type" className="rounded-lg">
                  {paper_type.map((paperType) => (
                    <Select.Option key={paperType.id} value={paperType.id}>
                      {paperType.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium text-base">
                    Royalties (VND)
                  </span>
                }
                name="royalties"
                rules={[{ required: true, message: "Please input budget!" }]}
              >
                <InputNumber
                  prefix={<DollarOutlined className="text-gray-400" />}
                  placeholder="Enter proposed royalties"
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
                              danger
                              type="text"
                              onClick={() => remove(field.name)}
                              icon={<DeleteOutlined />}
                              className="hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>

                          <Form.Item
                            {...field}
                            label={
                              <span className="text-gray-700 font-medium">
                                Milestone Name
                              </span>
                            }
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Milestone name is required",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter milestone name"
                              className="rounded-lg py-2.5"
                            />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            label={
                              <span className="text-gray-700 font-medium">
                                Deadline
                              </span>
                            }
                            name={[field.name, "deadline"]}
                            fieldKey={[field.fieldKey, "deadline"]}
                            rules={[
                              {
                                required: true,
                                message: "Deadline is required",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="Select deadline"
                              className="w-full rounded-lg"
                            />
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Form.List>
          </Card>

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

export default RegisterPaper;
