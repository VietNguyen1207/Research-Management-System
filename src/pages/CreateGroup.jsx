import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Divider,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MailOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Option } = Select;

const CreateGroup = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  // Mock data - replace with API calls
  const availableLecturers = [
    { id: 1, name: "Dr. Emily Smith", email: "emily.smith@university.edu" },
    { id: 2, name: "Prof. John Doe", email: "john.doe@university.edu" },
    { id: 3, name: "Dr. Sarah Johnson", email: "sarah.johnson@university.edu" },
  ];

  const handleAddMember = () => {
    if (emailInput && members.length < 5) {
      if (!members.some((member) => member.email === emailInput)) {
        setMembers([...members, { email: emailInput, role: "Member" }]);
        setEmailInput("");
      } else {
        message.error("This member is already added!");
      }
    } else if (members.length >= 5) {
      message.warning("Maximum 5 students allowed in a group!");
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member.email !== email));
  };

  const handleRoleChange = (email, role) => {
    setMembers(
      members.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    console.log("Members:", members);
    message.success("Group created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Group</h2>
          <p className="mt-2 text-sm text-gray-600">
            Form a research group with your colleagues and supervisors
          </p>
        </div>

        <Form
          form={form}
          name="create_group"
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Group Name"
              name="group_name"
              rules={[{ required: true, message: "Please input group name!" }]}
            >
              <Input
                prefix={<TeamOutlined className="text-gray-400" />}
                placeholder="Enter group name"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Divider>Supervisors</Divider>

          {/* Lecturer Selection */}
          <Form.Item
            label="Select Supervisors"
            name="lecturer_ids"
            rules={[
              {
                required: true,
                message: "Please select at least one supervisor!",
              },
              {
                validator: (_, value) =>
                  value && value.length <= 2
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Maximum 2 supervisors allowed!")
                      ),
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select supervisors (max 2)"
              className="rounded-lg"
              maxTagCount={2}
            >
              {availableLecturers.map((lecturer) => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name} ({lecturer.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>Group Members</Divider>

          {/* Member Addition */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members (max 5 students)
            </label>
            <div className="flex space-x-2">
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter member's email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="rounded-lg"
                onPressEnter={handleAddMember}
              />
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={handleAddMember}
                className="rounded-lg border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Member Tags with Role Selection */}
          <div className="mb-6">
            <Space size={[0, 8]} wrap>
              {members.map(({ email, role }) => (
                <Tag
                  key={email}
                  closable
                  onClose={() => handleRemoveMember(email)}
                  className="px-3 py-1 rounded-full bg-orange-50 border-orange-200"
                >
                  <span>{email}</span>
                  <Select
                    value={role}
                    onChange={(value) => handleRoleChange(email, value)}
                    className="ml-2"
                    style={{ width: 100 }}
                  >
                    <Option value="Leader">Leader</Option>
                    <Option value="Member">Member</Option>
                  </Select>
                </Tag>
              ))}
            </Space>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              icon={<SaveOutlined />}
              className="rounded-lg border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Create Group
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateGroup;
