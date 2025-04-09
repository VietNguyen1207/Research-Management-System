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
  Input,
  AutoComplete,
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
  UserSwitchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useGetCouncilGroupsQuery,
  useReInviteGroupMemberMutation,
} from "../../features/group/groupApiSlice";
import { useGetLecturersQuery } from "../../features/user/userApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const ManageCouncil = () => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteForm] = Form.useForm();
  const [emailInput, setEmailInput] = useState("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [isModalContentLoading, setIsModalContentLoading] = useState(false);

  // Fetch council groups using the API
  const {
    data: councilsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCouncilGroupsQuery();

  // Add this to fetch lecturers data
  const { data: lecturersData, isLoading: isLoadingLecturers } =
    useGetLecturersQuery();

  // Inside the component, add the re-invite mutation
  const [reInviteMember, { isLoading: isReInviting }] =
    useReInviteGroupMemberMutation();

  // Transformed data for UI display
  const councils = councilsData?.data || [];

  // Add this effect to update autocomplete options
  useEffect(() => {
    if (!emailInput || !lecturersData?.lecturers) {
      setAutoCompleteOptions([]);
      return;
    }

    const inputLower = emailInput.toLowerCase();
    const filteredLecturers = lecturersData.lecturers.filter(
      (lecturer) =>
        lecturer.email.toLowerCase().includes(inputLower) ||
        lecturer.fullName.toLowerCase().includes(inputLower)
    );

    const options = filteredLecturers.map((lecturer) => ({
      value: lecturer.email,
      label: (
        <div className="flex items-center space-x-2">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div className="flex flex-col">
            <div className="font-medium">{lecturer.fullName}</div>
            <div className="text-xs text-gray-500">
              {lecturer.levelText} • {lecturer.email}
            </div>
          </div>
        </div>
      ),
      lecturer: lecturer,
    }));

    setAutoCompleteOptions(options);
  }, [emailInput, lecturersData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 1: // Accepted
        return "success";
      case 0: // Pending
        return "warning";
      case 3: // Rejected
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
      case 3: // Declined
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
    setIsModalVisible(true);
    setIsModalContentLoading(true);

    // Simulate loading delay (remove this in production and use actual data loading state)
    setTimeout(() => {
      setSelectedCouncil(council);
      setIsModalContentLoading(false);
    }, 800);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCouncil(null);
  };

  const handleInviteMember = (council, role, memberId) => {
    // For Chairman and Secretary roles, keep the original check
    // For Council Members, check against the maximum allowed members
    const hasAcceptedMemberWithSameRole =
      role === 5
        ? council.members.filter((m) => m.role === 5 && m.status === 1)
            .length >= 3
        : council.members.some((m) => m.role === role && m.status === 1);

    if (hasAcceptedMemberWithSameRole) {
      const message =
        role === 5
          ? "Maximum number of council members (3) has been reached"
          : "This position has already been filled by another member";

      message.warning(message);
      return;
    }

    setSelectedCouncil(council);
    setSelectedRole(role);
    setIsInviteModalVisible(true);

    // Temporarily close the details modal when the invite modal opens
    setIsModalVisible(false);
  };

  const handleInviteModalCancel = () => {
    setIsInviteModalVisible(false);
    // Reopen the details modal
    setIsModalVisible(true);
  };

  // Handle selecting a lecturer from the dropdown
  const handleSelectLecturer = (email, option) => {
    const lecturer = option.lecturer;
    // Update form value when a lecturer is selected
    inviteForm.setFieldsValue({
      email,
      selectedLecturerId: lecturer.userId,
    });
  };

  // Update the handleInviteSubmit function
  const handleInviteSubmit = async (values) => {
    try {
      // Get selected lecturer details
      const selectedLecturer = lecturersData?.lecturers.find(
        (l) => l.email === values.email
      );

      if (!selectedLecturer) {
        message.error("Please select a valid lecturer");
        return;
      }

      // Prepare the request body
      const reInviteData = {
        groupId: selectedCouncil.groupId,
        memberEmail: selectedLecturer.email,
        memberName: selectedLecturer.fullName,
        role: selectedRole,
        message: `You have been invited to join the ${
          selectedCouncil.groupName
        } council as a ${
          selectedRole === 3
            ? "Chairman"
            : selectedRole === 4
            ? "Secretary"
            : "Council Member"
        }.`,
      };

      // Call the API
      await reInviteMember(reInviteData).unwrap();

      message.success(`Invitation sent to ${selectedLecturer.fullName}`);

      // Close invite modal
      setIsInviteModalVisible(false);

      // Reset form
      inviteForm.resetFields();

      // Refetch the data to show updated council info
      const response = await refetch();

      // Show loading indicator in modal
      setIsModalContentLoading(true);

      // Reopen details modal with loading indicator
      setIsModalVisible(true);

      if (response.data) {
        // Find the updated council from the refetched data
        const updatedCouncil = response.data.data.find(
          (c) => c.groupId === selectedCouncil.groupId
        );

        if (updatedCouncil) {
          // Set updated council data with a small delay to show loading effect
          setTimeout(() => {
            setSelectedCouncil(updatedCouncil);
            setIsModalContentLoading(false);
          }, 800);
        } else {
          // If council not found for some reason, stop loading
          setIsModalContentLoading(false);
        }
      } else {
        // If refetch didn't return data, stop loading
        setIsModalContentLoading(false);
      }
    } catch (error) {
      message.error(
        "Failed to send invitation: " + (error.data?.message || "Unknown error")
      );
    }
  };

  const renderMembersList = (members) => {
    // Group members by role for better organization
    const chairmen = members.filter((m) => m.role === 3);
    const secretaries = members.filter((m) => m.role === 4);
    const councilMembers = members.filter((m) => m.role === 5);

    // Function to render a single member with appropriate styling
    const renderMember = (member) => {
      // For Chairman and Secretary roles, keep the original check
      // For Council Members (role 5), check against the maximum allowed members (3)
      const hasAcceptedMemberWithSameRole =
        member.role === 5
          ? selectedCouncil.members.filter(
              (m) => m.role === 5 && m.status === 1
            ).length >= 3
          : selectedCouncil.members.some(
              (m) =>
                m.role === member.role &&
                m.status === 1 &&
                m.groupMemberId !== member.groupMemberId
            );

      // Update the tooltip message to be more specific
      const tooltipMessage =
        member.role === 5
          ? "Maximum number of council members (3) has been reached"
          : "This position has already been filled by another member";

      return (
        <List.Item key={member.groupMemberId}>
          <List.Item.Meta
            avatar={
              <Avatar
                style={{
                  backgroundColor:
                    member.role === 3
                      ? "#1890ff" // Chairman - blue
                      : member.role === 4
                      ? "#52c41a" // Secretary - green
                      : "#f56a00", // Council Member - orange
                  border:
                    getStatusColor(member.status) === "success"
                      ? "2px solid #52c41a"
                      : getStatusColor(member.status) === "warning"
                      ? "2px solid #faad14"
                      : "2px solid #ff4d4f",
                }}
              >
                {member.memberName.charAt(0)}
              </Avatar>
            }
            title={
              <div className="flex justify-between items-center">
                <Space>
                  <Text strong>{member.memberName}</Text>
                  <Tag
                    color={
                      member.role === 3
                        ? "blue"
                        : member.role === 4
                        ? "green"
                        : "orange"
                    }
                  >
                    {member.roleText}
                  </Tag>
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
                {member.status === 3 && !hasAcceptedMemberWithSameRole && (
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
                {member.status === 3 && hasAcceptedMemberWithSameRole && (
                  <Tooltip title={tooltipMessage}>
                    <Button
                      icon={<UserAddOutlined />}
                      disabled
                      className="border-none min-w-[90px] flex items-center justify-center opacity-50"
                      size="small"
                    >
                      <Space>
                        <span>Filled</span>
                      </Space>
                    </Button>
                  </Tooltip>
                )}
              </div>
            }
          />
        </List.Item>
      );
    };

    return (
      <div className="space-y-6">
        {chairmen.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <Text strong className="text-blue-500">
                Chairman
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={chairmen}
              renderItem={renderMember}
              className="bg-blue-50 rounded-lg p-2"
            />
          </div>
        )}

        {secretaries.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <Text strong className="text-green-500">
                Secretary
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={secretaries}
              renderItem={renderMember}
              className="bg-green-50 rounded-lg p-2"
            />
          </div>
        )}

        {councilMembers.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <Text strong className="text-orange-500">
                Council Members
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={councilMembers}
              renderItem={renderMember}
              className="bg-orange-50 rounded-lg p-2"
            />
          </div>
        )}
      </div>
    );
  };

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

  // Add this new skeleton component for the council details modal
  const CouncilDetailsSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <Descriptions bordered column={1}>
        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Created Date
            </Text>
          }
        >
          <Skeleton.Input style={{ width: 200 }} active size="small" />
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Status
            </Text>
          }
        >
          <Skeleton.Input style={{ width: 80 }} active size="small" />
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Members
            </Text>
          }
        >
          <div className="space-y-8">
            {/* Chairman section skeleton */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-300 mr-2"></div>
                <Text strong className="text-blue-300">
                  Chairman
                </Text>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                  <div className="flex-grow">
                    <Skeleton.Input
                      style={{ width: "80%" }}
                      active
                      size="small"
                      className="mb-2"
                    />
                    <Skeleton.Input
                      style={{ width: "60%" }}
                      active
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secretary section skeleton */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-green-300 mr-2"></div>
                <Text strong className="text-green-300">
                  Secretary
                </Text>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-200 mr-3"></div>
                  <div className="flex-grow">
                    <Skeleton.Input
                      style={{ width: "80%" }}
                      active
                      size="small"
                      className="mb-2"
                    />
                    <Skeleton.Input
                      style={{ width: "60%" }}
                      active
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Council members section skeleton */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-orange-300 mr-2"></div>
                <Text strong className="text-orange-300">
                  Council Members
                </Text>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                {/* Multiple council members */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center mb-4 last:mb-0">
                    <div className="w-10 h-10 rounded-full bg-orange-200 mr-3"></div>
                    <div className="flex-grow">
                      <Skeleton.Input
                        style={{ width: "80%" }}
                        active
                        size="small"
                        className="mb-2"
                      />
                      <Skeleton.Input
                        style={{ width: "60%" }}
                        active
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
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
                        }/${
                          council.members.filter((m) => m.status !== 3).length
                        }`}</Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (council.members.filter((m) => m.status === 1)
                            .length /
                            council.members.filter((m) => m.status !== 3)
                              .length) *
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

                    {/* Role summary section */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {council.members.some((m) => m.role === 3) && (
                          <Tooltip title="Chairman">
                            <Avatar className="bg-blue-500">C</Avatar>
                          </Tooltip>
                        )}
                        {council.members.some((m) => m.role === 4) && (
                          <Tooltip title="Secretary">
                            <Avatar className="bg-green-500">S</Avatar>
                          </Tooltip>
                        )}
                        <Tooltip
                          title={`Council Members (${
                            council.members.filter((m) => m.role === 5).length
                          })`}
                        >
                          <Avatar className="bg-orange-500">
                            {council.members.filter((m) => m.role === 5).length}
                          </Avatar>
                        </Tooltip>
                      </div>

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

                    {/* Status indicators */}
                    <div className="flex flex-wrap gap-2">
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        {council.members.filter((m) => m.status === 1).length}{" "}
                        Accepted
                      </Tag>
                      <Tag color="warning" icon={<ClockCircleOutlined />}>
                        {council.members.filter((m) => m.status === 0).length}{" "}
                        Pending
                      </Tag>
                      {council.members.filter((m) => m.status === 2).length >
                        0 && (
                        <Tag color="error" icon={<CloseCircleOutlined />}>
                          {council.members.filter((m) => m.status === 2).length}{" "}
                          Rejected
                        </Tag>
                      )}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}

        {/* Council Details Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <Text strong className="text-xl">
                {selectedCouncil
                  ? selectedCouncil.groupName
                  : "Council Details"}
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
            {isModalContentLoading ? (
              <CouncilDetailsSkeleton />
            ) : (
              selectedCouncil && (
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
              )
            )}
          </div>
        </Modal>

        {/* Replacement Invitation Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <UserSwitchOutlined className="text-orange-500 mr-2" />
              <span>Replace Council Member</span>
            </div>
          }
          open={isInviteModalVisible}
          onCancel={handleInviteModalCancel}
          footer={null}
          zIndex={1001}
          maskClosable={false}
        >
          <Form
            form={inviteForm}
            layout="vertical"
            onFinish={handleInviteSubmit}
          >
            <div className="space-y-4">
              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <Text>
                  You are replacing a{" "}
                  {selectedRole === 3
                    ? "Chairman"
                    : selectedRole === 4
                    ? "Secretary"
                    : "Council Member"}{" "}
                  who declined their invitation.
                </Text>
              </div>

              <Form.Item
                label="New Member"
                name="email"
                rules={[
                  { required: true, message: "Please select a lecturer" },
                ]}
              >
                <AutoComplete
                  value={emailInput}
                  options={autoCompleteOptions}
                  onSelect={handleSelectLecturer}
                  onChange={setEmailInput}
                  onSearch={setEmailInput}
                  style={{ width: "100%" }}
                  notFoundContent={
                    emailInput ? (
                      <div className="p-3 text-gray-500 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <SearchOutlined className="text-gray-300 text-xl mb-2" />
                          <span>No lecturers found</span>
                          <span className="text-xs mt-1">
                            You can still add this email manually
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-gray-500 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <TeamOutlined className="text-gray-300 text-xl mb-2" />
                          <span>Type to search for lecturers</span>
                        </div>
                      </div>
                    )
                  }
                >
                  <Input
                    className="rounded-lg py-2"
                    style={{ paddingLeft: "40px" }}
                    placeholder="Search for lecturers by name or email"
                    suffix={isLoadingLecturers ? <Spin size="small" /> : null}
                    prefix={
                      <SearchOutlined
                        className="text-gray-400"
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    }
                  />
                </AutoComplete>
              </Form.Item>

              {/* Add a hidden field to store the selected lecturer ID */}
              <Form.Item name="selectedLecturerId" hidden={true}>
                <Input />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleInviteModalCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isReInviting}
                    className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                  >
                    Send Invitation
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCouncil;
