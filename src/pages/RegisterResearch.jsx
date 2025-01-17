import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Upload,
  Slider,
  message,
  Tag,
  AutoComplete,
} from "antd";
import { UploadOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const RegisterResearch = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [budgetValue, setBudgetValue] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const studentEmails = [
    "emily.smith@example.com",
    "john.doe@example.com",
    "sarah.johnson@example.com",
    "michael.brown@example.com",
    "jessica.white@example.com",
  ];

  const onFinish = (values) => {
    console.log("Form values:", values);
    console.log("Team Members:", teamMembers);
    message.success("Research project submitted successfully!");
  };

  const addTeamMember = () => {
    if (newMember) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember("");
      setSuggestions([]);
    } else {
      message.warning("Please enter a team member's name.");
    }
  };

  const handleSearch = (value) => {
    if (value) {
      const filteredEmails = studentEmails.filter((email) =>
        email.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredEmails);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (value) => {
    setNewMember(value);
    setSuggestions([]);
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
            researcher_name: user?.full_name,
            department: user?.department_id,
            budget: 0,
          }}
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Form.Item
              label="Research Title"
              name="title"
              rules={[
                { required: true, message: "Please input research title!" },
              ]}
            >
              <Input
                placeholder="Enter the research title"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Research Type"
              name="type"
              rules={[
                { required: true, message: "Please select research type!" },
              ]}
            >
              <Select placeholder="Select research type" className="rounded-lg">
                <Select.Option value="scientific_paper">
                  Scientific Paper
                </Select.Option>
                <Select.Option value="research_project">
                  Research Project
                </Select.Option>
                <Select.Option value="thesis">Thesis</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Team Members Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Team Members
            </h3>
            <div className="flex mb-4">
              <AutoComplete
                placeholder="Enter team member's email"
                value={newMember}
                options={suggestions.map((email) => ({ value: email }))}
                onSearch={handleSearch}
                onSelect={handleSelect}
                onChange={(value) => setNewMember(value)}
                className="rounded-lg mr-2 w-full"
              />
              <Button
                type="primary"
                className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                onClick={addTeamMember}
              >
                Add Member
              </Button>
            </div>
            <div className="flex flex-wrap">
              {teamMembers.map((member, index) => (
                <Tag key={index} className="mr-2 mb-2">
                  {member}
                </Tag>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Project Details
            </h3>
            <Form.Item
              label="Context"
              name="context"
              rules={[{ required: true, message: "Please input context!" }]}
            >
              <TextArea
                placeholder="Enter project context"
                rows={4}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Research Objectives"
              name="objectives"
              rules={[{ required: true, message: "Please input objectives!" }]}
            >
              <TextArea
                placeholder="Enter research objectives"
                rows={4}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* Timeline and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Form.Item
              label="Project Timeline"
              name="timeline"
              rules={[{ required: true, message: "Please select timeline!" }]}
            >
              <RangePicker className="w-full rounded-lg" />
            </Form.Item>

            <Form.Item
              label="Estimated Budget (VND)"
              name="budget"
              rules={[{ required: true, message: "Please input budget!" }]}
            >
              <div className="space-y-2">
                <InputNumber
                  placeholder="Enter estimated budget"
                  className="w-full rounded-lg"
                  min={0}
                  max={1000000000}
                  value={budgetValue}
                  formatter={(value) =>
                    `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                  onChange={(value) => {
                    setBudgetValue(value);
                    form.setFieldsValue({ budget: value });
                  }}
                />
                <Slider
                  min={0}
                  max={1000000000}
                  step={1000000}
                  value={budgetValue}
                  tooltip={{
                    formatter: (value) => `₫${value.toLocaleString()}`,
                  }}
                  onChange={(value) => {
                    setBudgetValue(value);
                    form.setFieldsValue({ budget: value });
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₫0</span>
                  <span>₫500,000,000</span>
                  <span>₫1,000,000,000</span>
                </div>
              </div>
            </Form.Item>
          </div>

          {/* Documents Upload */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Supporting Documents
            </h3>
            <Form.Item
              name="proposal_file"
              rules={[
                { required: true, message: "Please upload proposal document!" },
              ]}
            >
              <Upload maxCount={1}>
                <Button icon={<UploadOutlined />} className="rounded-lg">
                  Upload Proposal Document
                </Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
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
