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
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RegisterCaseStudy = () => {
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Register Case Study
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide detailed information about your case study
          </p>
        </div>

        <Form
          form={form}
          name="register_case_study"
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md"
          initialValues={{
            submission_date: dayjs(),
            status: "Draft",
            priority_level: "Medium",
          }}
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input
                prefix={<FileTextOutlined className="text-gray-400" />}
                placeholder="Enter the working title of the paper"
              />
            </Form.Item>

            <Form.Item label="Abstract" name="abstract">
              <TextArea
                placeholder="Provide a brief overview of the paper"
                rows={4}
              />
            </Form.Item>
          </div>

          <Collapse
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="text-[#F2722B]"
              />
            )}
            className="mb-6 border border-gray-200 rounded-lg"
          >
            <Collapse.Panel
              header={
                <span className="font-medium text-gray-700">
                  Company Profile (Optional)
                </span>
              }
              key="1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Company Name"
                  name={["companyProfile", "name"]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>

                <Form.Item
                  label="Industry"
                  name={["companyProfile", "industry"]}
                >
                  <Input placeholder="Enter industry type" />
                </Form.Item>

                <Form.Item
                  label="Company Size"
                  name={["companyProfile", "size"]}
                >
                  <Select placeholder="Select company size">
                    <Option value="1-50 employees">1-50 employees</Option>
                    <Option value="51-200 employees">51-200 employees</Option>
                    <Option value="201-500 employees">201-500 employees</Option>
                    <Option value="500+ employees">500+ employees</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Company Website"
                  name={["companyProfile", "website"]}
                >
                  <Input placeholder="Enter company website" />
                </Form.Item>

                <Form.Item
                  label="Contact Person"
                  name={["companyProfile", "contactPerson"]}
                >
                  <Input placeholder="Name of company contact person" />
                </Form.Item>

                <Form.Item
                  label="Contact Email"
                  name={["companyProfile", "contactEmail"]}
                >
                  <Input placeholder="Email of company contact person" />
                </Form.Item>
              </div>
            </Collapse.Panel>
          </Collapse>
          <Divider>Authors Information</Divider>
          {authors.map((author, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <Form.Item
                label={`Author ${index + 1} Name`}
                name={["authors", index, "name"]}
                rules={[{ required: true, message: "Name is required!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full name" />
              </Form.Item>

              <Form.Item
                label="Role"
                name={["authors", index, "role"]}
                rules={[{ required: true, message: "Role is required!" }]}
              >
                <Select placeholder="Select author role">
                  {authorRoles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Email"
                name={["authors", index, "email"]}
                rules={[
                  { required: true, message: "Email is required!" },
                  { type: "email", message: "Invalid email!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email address" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name={["authors", index, "phone"]}
                rules={[{ required: true, message: "Phone is required!" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone number" />
              </Form.Item>

              {index > 0 && (
                <Button
                  danger
                  type="link"
                  onClick={() => removeAuthor(index)}
                  className="col-span-2 justify-self-end mb-4"
                >
                  <DeleteOutlined /> Remove Author
                </Button>
              )}
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
            className="mb-4 w-full"
          >
            <TeamOutlined /> Add Author
          </Button>
          <Divider>Study Scope</Divider>
          <Form.Item
            label="Primary Focus"
            name={["studyScope", "primary"]}
            rules={[{ required: true, message: "Please input primary focus!" }]}
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
              <Option value="On-site observations">On-site observations</Option>
              <Option value="Employee interviews">Employee interviews</Option>
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
            rules={[{ required: true, message: "Please describe the issue!" }]}
          >
            <TextArea placeholder="Describe the issue in detail" rows={4} />
          </Form.Item>
          <Form.Item label="Proposed Solutions" name="proposed_solutions">
            <TextArea
              placeholder="Provide suggestions for resolving the issue"
              rows={4}
            />
          </Form.Item>
          <Divider>Project Details</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Timeline"
              name="timeline"
              rules={[
                { required: true, message: "Please select project timeline!" },
              ]}
            >
              <RangePicker
                className="w-full"
                placeholder={["Start Date", "End Date"]}
              />
            </Form.Item>

            <Form.Item
              label="Budget (VND)"
              name="budget"
              rules={[{ required: true, message: "Please input the budget!" }]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-full"
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                placeholder="Enter required budget"
              />
            </Form.Item>

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
          <Divider>Documents</Divider>
          {/* Document Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Supporting Files" name="supporting_files">
              <Upload fileList={fileList} onChange={handleFileChange} multiple>
                <Button icon={<UploadOutlined />}>Upload Files</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Associated Documents" name="associated_documents">
              <Upload fileList={fileList} onChange={handleFileChange} multiple>
                <Button icon={<UploadOutlined />}>Upload Documents</Button>
              </Upload>
            </Form.Item>
          </div>
          {/* Hidden Fields */}
          <Form.Item name="submission_date" hidden>
            <Input />
          </Form.Item>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              icon={<SaveOutlined />}
              className="border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Submit Case Study
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterCaseStudy;
