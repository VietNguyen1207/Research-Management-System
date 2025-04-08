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
  Spin,
  Empty,
  Skeleton,
  Result,
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
import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const ManageCouncil = () => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteForm] = Form.useForm();

  // Fetch council groups using the API
  const {
    data: councilsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCouncilGroupsQuery();

  // Transformed data for UI display
  const councils = councilsData?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 1: // Accepted
        return "success";
      case 0: // Pending
        return "warning";
      case 2: // Declined
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: // Accepted
        return <CheckCircleOutlined className="text-green-500" />;
      case 0: // Pending
        return <ClockCircleOutlined className="text-yellow-500" />;
      case 2: // Declined
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getCouncilStats = () => {
    if (!councils.length)
      return {
        totalCouncils: 0,
        totalMembers: 0,
        acceptedMembers: 0,
        pendingMembers: 0,
      };

    const totalCouncils = councils.length;
    const totalMembers = councils.reduce(
      (acc, council) => acc + council.members.length,
      0
    );
    const acceptedMembers = councils.reduce(
      (acc, council) =>
        acc + council.members.filter((m) => m.status === 1).length,
      0
    );
    const pendingMembers = councils.reduce(
      (acc, council) =>
        acc + council.members.filter((m) => m.status === 0).length,
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
    // Implement invitation functionality
    // This would typically be an API call
    message.success("Invitation feature to be implemented");
    setIsInviteModalVisible(false);
    inviteForm.resetFields();
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
                {member.memberName.charAt(0)}
              </Avatar>
            }
            title={
              <div className="flex justify-between items-center">
                <Space>
                  <Text strong>{member.memberName}</Text>
                  <Text type="secondary">({member.roleText})</Text>
                </Space>
                <Tag
                  icon={getStatusIcon(member.status)}
                  color={getStatusColor(member.status)}
                >
                  {member.statusText}
                </Tag>
              </div>
            }
            description={
              <div className="flex justify-between items-center">
                <Text type="secondary">{member.memberEmail}</Text>
                {member.status === 2 && ( // Declined status
                  <Button
                    icon={<UserAddOutlined />}
                    onClick={() =>
                      handleInviteMember(
                        selectedCouncil,
                        member.role,
                        member.userId
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

  // Enhanced Statistics Cards Skeleton
  const StatisticsSkeleton = () => (
    <Row gutter={[16, 16]} className="mb-8">
      {[
        {
          icon: <BookOutlined className="text-[#FF8C00]" />,
          title: "Total Councils",
        },
        {
          icon: <TeamOutlined className="text-[#FF8C00]" />,
          title: "Total Members",
        },
        {
          icon: <CheckCircleOutlined className="text-[#FF8C00]" />,
          title: "Accepted Members",
        },
        {
          icon: <ClockCircleOutlined className="text-[#FF8C00]" />,
          title: "Pending Members",
        },
      ].map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-start">
              <div className="mr-3 mt-1">{stat.icon}</div>
              <div className="flex-1">
                <div className="text-gray-600 font-medium mb-2">
                  {stat.title}
                </div>
                <Skeleton.Input style={{ width: 60 }} active size="small" />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Enhanced Council Cards Skeleton with animated gradient
  const CouncilCardsSkeleton = () => (
    <List
      grid={{
        gutter: [16, 16],
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 3,
      }}
      dataSource={[1, 2, 3, 4, 5, 6]}
      renderItem={(item) => (
        <List.Item>
          <Card
            className="hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
            title={
              <div className="flex justify-between items-center">
                <Skeleton.Input style={{ width: 180 }} active size="small" />
                <Skeleton.Input style={{ width: 80 }} active size="small" />
              </div>
            }
          >
            <div className="space-y-6">
              <Skeleton active paragraph={{ rows: 1 }} />

              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton.Input style={{ width: 120 }} active size="small" />
                  <Skeleton.Input style={{ width: 40 }} active size="small" />
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full animate-pulse bg-gradient-to-r from-blue-300 to-green-300 rounded-full"></div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((avatar) => (
                    <div
                      key={avatar}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
                <Skeleton.Input style={{ width: 80 }} active size="small" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
              <Skeleton.Button active style={{ width: 100 }} />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  if (isLoading) {
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

          {/* Statistics Cards Skeleton */}
          <StatisticsSkeleton />

          {/* Council Cards Skeleton */}
          <CouncilCardsSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <Result
          status="error"
          title="Failed to load council groups"
          subTitle={error?.data?.message || "Please try again later"}
          extra={[
            <Button type="primary" key="retry" onClick={refetch}>
              Try Again
            </Button>,
          ]}
        />
      </div>
    );
  }

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
        {councils.length === 0 ? (
          <Empty
            description="No council groups found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            grid={{
              gutter: [16, 16],
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={councils}
            renderItem={(council) => (
              <List.Item>
                <Card
                  className="hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
                  title={
                    <div className="flex justify-between items-center">
                      <Text strong className="text-lg">
                        {council.groupName}
                      </Text>
                      <Tag color="orange" className="rounded-full px-3">
                        {new Date(council.createdAt).toLocaleDateString()}
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
                      Created:{" "}
                      {new Date(council.createdAt).toLocaleDateString()}
                    </Text>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Text type="secondary">Member Acceptance</Text>
                        <Text strong>{`${
                          council.members.filter((m) => m.status === 1).length
                        }/${council.members.length}`}</Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (council.members.filter((m) => m.status === 1)
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
                            title={`${member.memberName} (${member.statusText})`}
                            key={member.groupMemberId}
                          >
                            <Avatar
                              style={{
                                backgroundColor:
                                  getStatusColor(member.status) === "success"
                                    ? "#52c41a"
                                    : getStatusColor(member.status) ===
                                      "warning"
                                    ? "#faad14"
                                    : "#ff4d4f",
                              }}
                            >
                              {member.memberName.charAt(0)}
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
                                council.members.filter((m) => m.status === 1)
                                  .length
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
        )}

        {/* Council Details Modal */}
        {selectedCouncil && (
          <Modal
            title={
              <div className="flex items-center space-x-2">
                <Text strong className="text-xl">
                  {selectedCouncil.groupName}
                </Text>
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
                  {new Date(selectedCouncil.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Status</Text>}>
                  {selectedCouncil.status === 1 ? "Active" : "Inactive"}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Members</Text>}>
                  {renderMembersList(selectedCouncil.members)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageCouncil;
