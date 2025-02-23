import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Space,
  Tag,
  List,
  Avatar,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const CreateCouncil = () => {
  const [form] = Form.useForm();
  const [selectedMembers, setSelectedMembers] = useState({
    chairman: null,
    secretary: null,
    members: [],
  });
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  // Mock data for available lecturers
  const availableLecturers = [
    { id: 1, name: "Dr. John Smith", expertise: "AI", education: "Professor" },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      expertise: "IoT",
      education: "Associate Professor",
    },
    {
      id: 3,
      name: "Prof. Michael Brown",
      expertise: "Data Science",
      education: "Professor",
    },
    {
      id: 4,
      name: "Dr. Emily White",
      expertise: "Cybersecurity",
      education: "Doctor",
    },
    {
      id: 5,
      name: "Dr. James Green",
      expertise: "Software Engineering",
      education: "Senior Lecturer",
    },
    { id: 6, name: "Dr. Linda Black", expertise: "AI", education: "Lecturer" },
    // Add more lecturers as needed
  ];

  const expertiseOptions = [
    "AI",
    "IoT",
    "Data Science",
    "Cybersecurity",
    "Software Engineering",
  ];

  const handleSubmit = async (values) => {
    try {
      console.log("Form values:", values);
      message.success("Council created successfully");
      form.resetFields();
      setSelectedMembers({
        chairman: null,
        secretary: null,
        members: [],
      });
      setSelectedExpertise(null);
    } catch (error) {
      message.error("Failed to create council");
    }
  };

  const filterAvailableLecturers = (role) => {
    const selectedIds = [
      selectedMembers.chairman?.id,
      selectedMembers.secretary?.id,
      ...selectedMembers.members.map((m) => m.id),
    ].filter(Boolean);

    return availableLecturers.filter(
      (lecturer) =>
        !selectedIds.includes(lecturer.id) &&
        lecturer.expertise === selectedExpertise &&
        ((role === "chairman" && lecturer.education === "Professor") ||
          (role === "secretary" && lecturer.education !== "Professor") ||
          role === undefined)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Review Council
          </h2>
          <p className="text-gray-600">
            Form a council to review research proposals
          </p>
        </div>

        <Card className="shadow-lg rounded-xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            {/* Council Basic Information */}
            <div className="space-y-4">
              <Form.Item
                label="Council Name"
                name="councilName"
                rules={[
                  { required: true, message: "Please enter council name" },
                ]}
              >
                <Input placeholder="Enter council name" />
              </Form.Item>

              <Form.Item
                label="Expertise"
                name="expertise"
                rules={[{ required: true, message: "Please select expertise" }]}
              >
                <Select
                  placeholder="Select expertise"
                  onChange={(value) => setSelectedExpertise(value)}
                >
                  {expertiseOptions.map((expertise) => (
                    <Option key={expertise} value={expertise}>
                      {expertise}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Review Date"
                name="reviewDate"
                rules={[
                  { required: true, message: "Please select review date" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            {/* Council Members Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Council Members
              </h3>

              {/* Chairman Selection */}
              <Form.Item
                label="Chairman"
                name="chairman"
                rules={[{ required: true, message: "Please select chairman" }]}
              >
                <Select
                  placeholder="Select chairman"
                  onChange={(value) => {
                    const chairman = availableLecturers.find(
                      (l) => l.id === value
                    );
                    setSelectedMembers((prev) => ({ ...prev, chairman }));
                  }}
                  disabled={!selectedExpertise}
                >
                  {filterAvailableLecturers("chairman").map((lecturer) => (
                    <Option key={lecturer.id} value={lecturer.id}>
                      <div className="flex items-center">
                        <span>{lecturer.name}</span>
                        <Tag className="ml-2" color="blue">
                          {lecturer.expertise}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Secretary Selection */}
              <Form.Item
                label="Secretary"
                name="secretary"
                rules={[{ required: true, message: "Please select secretary" }]}
              >
                <Select
                  placeholder="Select secretary"
                  onChange={(value) => {
                    const secretary = availableLecturers.find(
                      (l) => l.id === value
                    );
                    setSelectedMembers((prev) => ({ ...prev, secretary }));
                  }}
                  disabled={!selectedExpertise}
                >
                  {filterAvailableLecturers("secretary").map((lecturer) => (
                    <Option key={lecturer.id} value={lecturer.id}>
                      <div className="flex items-center">
                        <span>{lecturer.name}</span>
                        <Tag className="ml-2" color="blue">
                          {lecturer.expertise}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Members Selection */}
              <Form.Item
                label="Members"
                name="members"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one member",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select members"
                  onChange={(values) => {
                    const members = availableLecturers.filter((l) =>
                      values.includes(l.id)
                    );
                    setSelectedMembers((prev) => ({ ...prev, members }));
                  }}
                  labelInValue
                  disabled={!selectedExpertise}
                >
                  {filterAvailableLecturers().map((lecturer) => (
                    <Option key={lecturer.id} value={lecturer.id}>
                      <div className="flex items-center">
                        <span>{lecturer.name}</span>
                        <Tag className="ml-2" color="blue">
                          {lecturer.expertise}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#FF8C00]/90 hover:to-[#FFA500]/90"
              >
                Create Council
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCouncil;
