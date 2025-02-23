import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Button,
  Tag,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Space,
  Progress,
  Tooltip,
  Typography,
  Divider,
  Select,
  Form,
  message,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ManageCouncil = () => {
  const [councils, setCouncils] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteForm] = Form.useForm();

  // Mock data for councils
  useEffect(() => {
    // Fetch councils from the backend or use mock data
    const mockCouncils = [
      {
        id: 1,
        name: "AI Research Council",
        expertise: "AI",
        createdDate: "2024-03-15",
        description: "Review and evaluate AI research proposals",
        members: [
          {
            id: 1,
            name: "Dr. John Smith",
            role: "Chairman",
            status: "Accepted",
            avatar: "JS",
            education: "Professor",
          },
          {
            id: 2,
            name: "Dr. Sarah Johnson",
            role: "Secretary",
            status: "Pending",
            avatar: "SJ",
            education: "Associate Professor",
          },
          {
            id: 3,
            name: "Prof. Michael Brown",
            role: "Member",
            status: "Accepted",
            avatar: "MB",
            education: "Professor",
          },
          {
            id: 4,
            name: "Dr. Lisa Chen",
            role: "Member",
            status: "Pending",
            avatar: "LC",
            education: "Senior Lecturer",
          },
        ],
      },
      {
        id: 2,
        name: "IoT Review Council",
        expertise: "IoT",
        createdDate: "2024-03-10",
        description: "Evaluate IoT research and development proposals",
        members: [
          {
            id: 5,
            name: "Dr. Emily White",
            role: "Chairman",
            status: "Accepted",
            avatar: "EW",
            education: "Professor",
          },
          {
            id: 6,
            name: "Dr. James Green",
            role: "Secretary",
            status: "Declined",
            avatar: "JG",
            education: "Doctor",
          },
          {
            id: 7,
            name: "Prof. David Lee",
            role: "Member",
            status: "Accepted",
            avatar: "DL",
            education: "Professor",
          },
        ],
      },
    ];
    setCouncils(mockCouncils);
  }, []);

  // Mock data for available lecturers to invite
  const availableLecturers = [
    {
      id: 8,
      name: "Dr. Rachel Adams",
      expertise: "AI",
      education: "Professor",
    },
    {
      id: 9,
      name: "Dr. Tom Wilson",
      expertise: "IoT",
      education: "Associate Professor",
    },
    {
      id: 10,
      name: "Prof. Karen Davis",
      expertise: "Data Science",
      education: "Professor",
    },
    // Add more as needed
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "success";
      case "Pending":
        return "warning";
      case "Declined":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircleOutlined className="text-green-500" />;
      case "Pending":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "Declined":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getCouncilStats = () => {
    const totalCouncils = councils.length;
    const totalMembers = councils.reduce(
      (acc, council) => acc + council.members.length,
      0
    );
    const acceptedMembers = councils.reduce(
      (acc, council) =>
        acc + council.members.filter((m) => m.status === "Accepted").length,
      0
    );
    const pendingMembers = councils.reduce(
      (acc, council) =>
        acc + council.members.filter((m) => m.status === "Pending").length,
      0
    );

    return { totalCouncils, totalMembers, acceptedMembers, pendingMembers };
  };

  const stats = getCouncilStats();

  const showCouncilDetails = (council) => {
    setSelectedCouncil(council);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCouncil(null);
  };

  const handleInviteMember = (council, role, memberId) => {
    setSelectedCouncil(council);
    setSelectedRole(role);
    setIsInviteModalVisible(true);
  };

  const handleInviteSubmit = async (values) => {
    try {
      // Here you would typically make an API call to send the invitation
      const newMember = {
        id: values.lecturer,
        name: availableLecturers.find((l) => l.id === values.lecturer).name,
        role: selectedRole,
        status: "Pending",
        avatar: "NA",
        education: availableLecturers.find((l) => l.id === values.lecturer)
          .education,
      };

      // Update the councils state with the new member
      setCouncils(
        councils.map((council) => {
          if (council.id === selectedCouncil.id) {
            return {
              ...council,
              members: [...council.members, newMember],
            };
          }
          return council;
        })
      );

      message.success("Invitation sent successfully");
      setIsInviteModalVisible(false);
      inviteForm.resetFields();
    } catch (error) {
      message.error("Failed to send invitation");
    }
  };

  const filterAvailableLecturers = (role) => {
    const selectedIds = selectedCouncil?.members.map((m) => m.id) || [];
    return availableLecturers.filter(
      (lecturer) =>
        !selectedIds.includes(lecturer.id) &&
        lecturer.expertise === selectedCouncil?.expertise &&
        ((role === "Chairman" && lecturer.education === "Professor") ||
          role !== "Chairman")
    );
  };

  const renderMembersList = (members) => (
    <List
      itemLayout="horizontal"
      dataSource={members}
      renderItem={(member) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                style={{
                  backgroundColor:
                    getStatusColor(member.status) === "success"
                      ? "#52c41a"
                      : getStatusColor(member.status) === "warning"
                      ? "#faad14"
                      : "#ff4d4f",
                }}
              >
                {member.avatar}
              </Avatar>
            }
            title={
              <div className="flex justify-between items-center">
                <Space>
                  <Text strong>{member.name}</Text>
                  <Text type="secondary">({member.education})</Text>
                </Space>
                <Tag
                  icon={getStatusIcon(member.status)}
                  color={getStatusColor(member.status)}
                >
                  {member.status}
                </Tag>
              </div>
            }
            description={
              <div className="flex justify-between items-center">
                <Text type="secondary">Role: {member.role}</Text>
                {member.status === "Declined" && (
                  <Button
                    icon={<UserAddOutlined />}
                    onClick={() =>
                      handleInviteMember(
                        selectedCouncil,
                        member.role,
                        member.id
                      )
                    }
                    className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] text-white border-none min-w-[90px] flex items-center justify-center"
                    size="small"
                  >
                    <Space>
                      <span>Replace</span>
                    </Space>
                  </Button>
                )}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const renderInviteModal = () => (
    <Modal
      title="Invite New Member"
      open={isInviteModalVisible}
      onCancel={() => {
        setIsInviteModalVisible(false);
        inviteForm.resetFields();
      }}
      footer={null}
      zIndex={2000}
      maskStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <Form form={inviteForm} layout="vertical" onFinish={handleInviteSubmit}>
        <Form.Item
          name="lecturer"
          label="Select Lecturer"
          rules={[{ required: true, message: "Please select a lecturer" }]}
        >
          <Select placeholder="Choose a lecturer">
            {filterAvailableLecturers(selectedRole).map((lecturer) => (
              <Option key={lecturer.id} value={lecturer.id}>
                <div className="flex justify-between">
                  <span>{lecturer.name}</span>
                  <Tag color="blue">{lecturer.education}</Tag>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsInviteModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Send Invitation
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Manage Review Councils
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage the status of academic review councils
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Councils
                  </span>
                }
                value={stats.totalCouncils}
                prefix={<BookOutlined className="text-[#FF8C00]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Members
                  </span>
                }
                value={stats.totalMembers}
                prefix={<TeamOutlined className="text-[#FF8C00]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Accepted Members
                  </span>
                }
                value={stats.acceptedMembers}
                prefix={<CheckCircleOutlined className="text-[#FF8C00]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Pending Members
                  </span>
                }
                value={stats.pendingMembers}
                prefix={<ClockCircleOutlined className="text-[#FF8C00]" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Councils List */}
        <List
          grid={{ gutter: [16, 16], xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={councils}
          renderItem={(council) => (
            <List.Item>
              <Card
                className="hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
                title={
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      {council.name}
                    </Text>
                    <Tag color="orange" className="rounded-full px-3">
                      {council.expertise}
                    </Tag>
                  </div>
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => showCouncilDetails(council)}
                    className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                  >
                    View Details
                  </Button>,
                ]}
              >
                <div className="space-y-4">
                  <Text type="secondary" className="block">
                    <CalendarOutlined className="mr-2" />
                    Created: {council.createdDate}
                  </Text>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Text type="secondary">Member Acceptance</Text>
                      <Text strong>{`${
                        council.members.filter((m) => m.status === "Accepted")
                          .length
                      }/${council.members.length}`}</Text>
                    </div>
                    <Progress
                      percent={Math.round(
                        (council.members.filter((m) => m.status === "Accepted")
                          .length /
                          council.members.length) *
                          100
                      )}
                      size="small"
                      status="active"
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Avatar.Group
                      maxCount={3}
                      maxStyle={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      }}
                    >
                      {council.members.map((member) => (
                        <Tooltip
                          title={`${member.name} (${member.status})`}
                          key={member.id}
                        >
                          <Avatar
                            style={{
                              backgroundColor:
                                getStatusColor(member.status) === "success"
                                  ? "#52c41a"
                                  : getStatusColor(member.status) === "warning"
                                  ? "#faad14"
                                  : "#ff4d4f",
                            }}
                          >
                            {member.avatar}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                    <Space>
                      <Badge
                        status="success"
                        text={
                          <Text type="secondary">
                            {`${
                              council.members.filter(
                                (m) => m.status === "Accepted"
                              ).length
                            } Accepted`}
                          </Text>
                        }
                      />
                    </Space>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />

        {/* Council Details Modal */}
        {selectedCouncil && (
          <Modal
            title={
              <div className="flex items-center space-x-2">
                <Text strong className="text-xl">
                  {selectedCouncil.name}
                </Text>
                <Tag color="orange" className="rounded-full">
                  {selectedCouncil.expertise}
                </Tag>
              </div>
            }
            open={isModalVisible}
            onCancel={handleModalClose}
            width={700}
            footer={[
              <Button
                key="close"
                onClick={handleModalClose}
                className="hover:bg-gray-100"
              >
                Close
              </Button>,
            ]}
            zIndex={1000}
            className="council-details-modal"
          >
            <div className="space-y-6">
              <Descriptions bordered column={1}>
                <Descriptions.Item label={<Text strong>Created Date</Text>}>
                  {selectedCouncil.createdDate}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Description</Text>}>
                  {selectedCouncil.description}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Members</Text>}>
                  {renderMembersList(selectedCouncil.members)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Modal>
        )}

        {/* Render Invite Modal */}
        {renderInviteModal()}
      </div>
    </div>
  );
};

export default ManageCouncil;
