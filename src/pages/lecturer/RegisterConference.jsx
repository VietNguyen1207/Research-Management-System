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
} from "@ant-design/icons";

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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Register Conference Paper
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide detailed information about your conference paper
          </p>
        </div>

        <Form
          form={form}
          name="register_conference"
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          {/* Paper Details */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Paper Title"
              name="title"
              rules={[{ required: true, message: "Please input paper title!" }]}
            >
              <Input
                prefix={<FileTextOutlined className="text-gray-400" />}
                placeholder="Enter the full title of the paper"
              />
            </Form.Item>
            <Form.Item
              label="Abstract"
              name="abstract"
              rules={[{ required: true, message: "Please input abstract!" }]}
            >
              <TextArea
                placeholder="Provide a concise summary of the paper (250-300 words)"
                rows={4}
              />
            </Form.Item>
            {/* <Divider>Travel Details (Optional)</Divider> */}
            <Collapse
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 90 : 0}
                  className="text-[#F2722B]"
                />
              )}
              className="mb-6 border border-gray-200 rounded-lg"
            >
              <Panel
                header={
                  <span className="font-medium text-gray-700">
                    Travel Details (Optional)
                  </span>
                }
                key="1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Duration"
                    name={["travelDetails", "duration"]}
                    extra="How long you plan to attend the conference"
                  >
                    <Input placeholder="e.g., 5 days" />
                  </Form.Item>

                  <Form.Item
                    label="Transportation Type"
                    name={["travelDetails", "transportationType"]}
                  >
                    <Select placeholder="Select transportation type">
                      <Option value="International Flight">
                        International Flight
                      </Option>
                      <Option value="Domestic Flight">Domestic Flight</Option>
                      <Option value="Train">Train</Option>
                      <Option value="Bus">Bus</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Accommodation"
                    name={["travelDetails", "accommodation"]}
                  >
                    <Input placeholder="e.g., Conference Hotel" />
                  </Form.Item>

                  <Form.Item
                    label="Additional Travel Notes"
                    name={["travelDetails", "notes"]}
                  >
                    <TextArea
                      placeholder="Any additional travel-related information"
                      rows={3}
                    />
                  </Form.Item>
                </div>
              </Panel>
            </Collapse>
          </div>

          <Divider>Conference Details</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Conference Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please input conference location!",
                },
              ]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Enter conference location"
              />
            </Form.Item>

            <Form.Item
              label="Presentation Type"
              name="presentationType"
              rules={[
                { required: true, message: "Please select presentation type!" },
              ]}
            >
              <Select placeholder="Select presentation type">
                <Option value="Oral Presentation">Oral Presentation</Option>
                <Option value="Poster Presentation">Poster Presentation</Option>
                <Option value="Workshop">Workshop</Option>
                <Option value="Panel Discussion">Panel Discussion</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Publishing Journal"
            name="publishingJournal"
            rules={[
              { required: true, message: "Please input publishing journal!" },
            ]}
          >
            <Input
              prefix={<BookOutlined />}
              placeholder="Enter target publishing journal"
            />
          </Form.Item>

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
                  <Select.Option value="Main Author">Main Author</Select.Option>
                  <Select.Option value="Co-Author">Co-Author</Select.Option>
                  <Select.Option value="Corresponding Author">
                    Corresponding Author
                  </Select.Option>
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
                  onClick={() =>
                    setAuthors(authors.filter((_, i) => i !== index))
                  }
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

          <Divider>Conference Details</Divider>

          {/* Conference Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Conference Name"
              name="conference_name"
              rules={[
                { required: true, message: "Conference name is required!" },
              ]}
            >
              <Input
                prefix={<BookOutlined />}
                placeholder="Enter conference name"
              />
            </Form.Item>

            <Form.Item
              label="Conference Date"
              name="conference_date"
              rules={[
                { required: true, message: "Conference date is required!" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Conference Venue"
              name="venue"
              rules={[{ required: true, message: "Venue is required!" }]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Enter conference location"
              />
            </Form.Item>

            <Form.Item
              label="Field of Research"
              name="field"
              rules={[
                { required: true, message: "Research field is required!" },
              ]}
            >
              <Select placeholder="Select field of research">
                {researchFields.map((field) => (
                  <Select.Option key={field} value={field}>
                    {field}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Divider>Research Details</Divider>

          {/* Research Information */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Purpose of the Paper"
              name="purpose"
              rules={[{ required: true, message: "Purpose is required!" }]}
            >
              <TextArea
                prefix={<AimOutlined />}
                placeholder="Explain the goal of your research"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="Methodology"
              name="methodology"
              rules={[{ required: true, message: "Methodology is required!" }]}
            >
              <TextArea
                prefix={<ExperimentOutlined />}
                placeholder="Describe your research approach"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="Expected Outcomes"
              name="expected_outcomes"
              rules={[
                { required: true, message: "Expected outcomes are required!" },
              ]}
            >
              <TextArea
                prefix={<CheckOutlined />}
                placeholder="Describe anticipated results"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="Keywords"
              name="keywords"
              rules={[{ required: true, message: "Please input keywords!" }]}
            >
              <Select
                mode="tags"
                placeholder="Enter keywords (e.g., Artificial Intelligence, Data Science)"
                className="w-full"
              />
            </Form.Item>
          </div>

          <Divider>Additional Information</Divider>

          {/* Supporting Documents and Budget */}
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
              label="Budget (VND)"
              name="budget"
              rules={[
                { required: true, message: "Budget information is required!" },
              ]}
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

          {/* Hidden Fields */}
          <Form.Item name="submission_date" hidden>
            <Input type="hidden" value={new Date().toISOString()} />
          </Form.Item>

          <Form.Item name="status" hidden>
            <Input type="hidden" value="pending" />
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
              Submit Paper
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterConference;
