import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Input,
  Tag,
  Tooltip,
  Space,
  message,
  Divider,
  Progress,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const PendingRequest = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);

  // Mock data - replace with actual API call
  const researchProjects = [
    {
      id: 1,
      title: "AI Implementation in Healthcare",
      researcher: "Dr. Emily Smith",
      type: "Research Project",
      requestedBudget: 500000000,
      approvedBudget: 450000000,
      requestedMembers: 5,
      approvedMembers: 4,
      timeline: ["2024-03-01", "2024-12-31"],
      status: "pending",
      department: "Computer Science",
      description:
        "Research on implementing AI solutions in healthcare diagnostics",
    },
  ];

  const columns = [
    {
      title: "Research Information",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (text, record) => (
        <div>
          <div className="text-lg font-semibold text-gray-800">{text}</div>
          <div className="text-sm text-gray-500 mt-1">{record.department}</div>
          <div className="text-sm text-gray-600 mt-2">{record.description}</div>
          <div className="mt-2">
            <Tag color="blue">{record.type}</Tag>
            <Tag
              color={
                record.status === "pending"
                  ? "gold"
                  : record.status === "approved"
                  ? "green"
                  : "red"
              }
            >
              {record.status.toUpperCase()}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Resource Requests",
      key: "resources",
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Budget</span>
                <span className="text-sm font-medium">
                  {record.approvedBudget ? (
                    <span className="text-green-600">
                      ₫{record.approvedBudget.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-900">
                      ₫{record.requestedBudget.toLocaleString()}
                    </span>
                  )}
                </span>
              </div>
              <Progress
                percent={
                  record.approvedBudget
                    ? (record.approvedBudget / record.requestedBudget) * 100
                    : 100
                }
                status={record.approvedBudget ? "success" : "active"}
                strokeColor={record.approvedBudget ? "#52c41a" : "#1890ff"}
              />
            </div>
          </div>

          <div className="flex items-center">
            <TeamOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Team Size</span>
                <span className="text-sm font-medium">
                  {record.approvedMembers ? (
                    <span className="text-green-600">
                      {record.approvedMembers} members
                    </span>
                  ) : (
                    <span className="text-gray-900">
                      {record.requestedMembers} members
                    </span>
                  )}
                </span>
              </div>
              <Progress
                percent={
                  record.approvedMembers
                    ? (record.approvedMembers / record.requestedMembers) * 100
                    : 100
                }
                status={record.approvedMembers ? "success" : "active"}
                strokeColor={record.approvedMembers ? "#52c41a" : "#1890ff"}
              />
            </div>
          </div>

          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600">Timeline: </span>
              <span className="font-medium">
                {record.timeline[0]} to {record.timeline[1]}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => (
        <div className="space-y-2 flex flex-col items-center">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none w-32"
          >
            Approve
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleDecline(record)}
            className="w-32"
          >
            Decline
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none w-32"
          >
            Adjust Paper
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (research) => {
    setSelectedResearch(research);
    form.setFieldsValue({
      budget: research.approvedBudget || research.requestedBudget,
      members: research.approvedMembers || research.requestedMembers,
      timeline: research.timeline,
      notes: research.notes,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Updated values:", values);
      message.success("Paper updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleApprove = (research) => {
    message.success(`Research "${research.title}" has been approved`);
  };

  const handleDecline = (research) => {
    message.error(`Research "${research.title}" has been declined`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Research Paper</h2>
          <p className="mt-2 text-sm text-gray-600">
            Review and adjust resource allocations for research projects
          </p>
        </div>

        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={researchProjects}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-table"
            rowClassName="align-top"
          />
        </Card>

        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold text-gray-800">
                Adjust Research Paper
              </div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedResearch?.title}
              </div>
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsModalVisible(false)}
              icon={<CloseOutlined />}
              className="border-gray-300"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleModalOk}
              icon={<CheckOutlined />}
              className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Update Paper
            </Button>,
          ]}
        >
          <Divider className="my-4" />
          <Form form={form} layout="vertical" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <DollarOutlined className="mr-2" />
                    Approved Budget (VND)
                  </span>
                }
                name="budget"
                rules={[
                  { required: true, message: "Please input approved budget!" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(value) =>
                    `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                  min={0}
                  max={1000000000}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <TeamOutlined className="mr-2" />
                    Approved Team Size
                  </span>
                }
                name="members"
                rules={[
                  {
                    required: true,
                    message: "Please input approved team size!",
                  },
                ]}
              >
                <InputNumber className="w-full" min={1} max={10} />
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    Approved Timeline
                  </span>
                }
                name="timeline"
                rules={[
                  {
                    required: true,
                    message: "Please select approved timeline!",
                  },
                ]}
              >
                <RangePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Notes"
                name="notes"
                tooltip={{
                  title: "Provide reasoning for quota adjustments",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter any notes or justification for the quota adjustments..."
                  className="w-full"
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PendingRequest;
