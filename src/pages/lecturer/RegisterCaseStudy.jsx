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
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

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

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Case study submitted successfully!");
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5); // Keep last 5 files
    setFileList(fileList);
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

          <Divider>Authors Information</Divider>

          {/* Authors Section */}
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

          <Divider>Issue Details</Divider>

          {/* Issue Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Type of Issue"
              name="issue_type"
              rules={[{ required: true, message: "Please select issue type!" }]}
            >
              <Select
                placeholder="Select issue type"
                onChange={(value) => setOtherIssueSelected(value === "Other")}
              >
                {issueTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {otherIssueSelected && (
              <Form.Item
                label="Other Issue Description"
                name="other_issue_description"
                rules={[
                  { required: true, message: "Please describe the issue!" },
                ]}
              >
                <Input placeholder="Describe the other issue type" />
              </Form.Item>
            )}

            <Form.Item label="Related Project" name="related_project">
              <Select placeholder="Link to existing project">
                {existingProjects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Priority Level"
              name="priority_level"
              rules={[{ required: true, message: "Please select priority!" }]}
            >
              <Radio.Group>
                <Radio.Button value="Low">Low</Radio.Button>
                <Radio.Button value="Medium">Medium</Radio.Button>
                <Radio.Button value="High">High</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>

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

          <Divider>Assignment and Status</Divider>

          {/* Assignment and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Responsible Person/Team"
              name="responsible_person"
              rules={[
                {
                  required: true,
                  message: "Please select responsible person!",
                },
              ]}
            >
              <Select placeholder="Select responsible person/team">
                {responsiblePersons.map((person) => (
                  <Option key={person.id} value={person.id}>
                    {person.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Field of Research"
              name="field_of_research"
              rules={[
                { required: true, message: "Please select research field!" },
              ]}
            >
              <Select placeholder="Select field of research">
                {researchFields.map((field) => (
                  <Option key={field} value={field}>
                    {field}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Current Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select placeholder="Select current status">
                <Option value="Draft">Draft</Option>
                <Option value="In Review">In Review</Option>
                <Option value="Needs Revision">Needs Revision</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Resolution Deadline" name="resolution_deadline">
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item label="Review Comments" name="review_comments">
            <TextArea
              placeholder="Add feedback from reviewers or supervisors"
              rows={4}
            />
          </Form.Item>

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
