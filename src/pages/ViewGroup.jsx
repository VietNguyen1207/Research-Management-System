import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Empty,
  Button,
  message,
  Spin,
  List,
  Row,
  Col,
  Statistic,
  Avatar,
  Space,
  Progress,
  Badge,
  Typography,
  Modal,
  Descriptions,
  Skeleton,
  Result,
  Tooltip,
  Form,
  AutoComplete,
  Input,
  Pagination,
  Select,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  SearchOutlined,
  BankOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useGetUserGroupsQuery,
  useGetLecturersQuery,
  useGetStudentsQuery,
  useGetUserBasicGroupsQuery,
  useGetAcademicUsersQuery,
} from "../features/user/userApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useReInviteGroupMemberMutation,
  getGroupTypeName,
} from "../features/group/groupApiSlice";
import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;

// Add the GroupStatusEnum mapping
const GROUP_STATUS = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
  3: "Assigned",
};

// Add status colors for group statuses
const GROUP_STATUS_COLORS = {
  0: "gold", // Pending - yellow/gold
  1: "green", // Active - green
  2: "default", // Inactive - gray
  3: "cyan", // Assigned - cyan (or your preferred color)
};

// Add status icons for group statuses
const getGroupStatusIcon = (status) => {
  switch (status) {
    case 1: // Active
      return <CheckCircleOutlined className="text-green-500" />;
    case 0: // Pending
      return <ClockCircleOutlined className="text-yellow-500" />;
    case 2: // Inactive
      return <StopOutlined className="text-gray-500" />;
    case 3: // Assigned
      return <LinkOutlined className="text-cyan-500" />;
    default:
      return null;
  }
};

const ViewGroup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalContentLoading, setIsModalContentLoading] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteForm] = Form.useForm();
  const [emailInput, setEmailInput] = useState("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState(null);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // First, add these state variables near the other state declarations
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch basic group data
  const { data: basicGroups, isLoading: isLoadingBasicGroups } =
    useGetUserBasicGroupsQuery();

  // Still keep the detailed query for member info
  const {
    data: groupsWithMembers,
    isLoading: isLoadingDetails,
    isError,
    error,
    refetch,
  } = useGetUserGroupsQuery(userId, {
    skip: !userId,
  });

  // Determine overall loading state
  const isLoading = isLoadingBasicGroups || isLoadingDetails;

  // Add effect to refetch data when navigating to this page
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, location.pathname, refetch]);

  // Combine the data - use basicGroups as the base and enhance with detailed info
  const combinedGroups = React.useMemo(() => {
    if (!basicGroups) return [];

    return basicGroups.map((group) => {
      const detailedGroup = groupsWithMembers?.find(
        (g) => g.groupId === group.groupId
      );
      return detailedGroup
        ? {
            ...group,
            members: detailedGroup.members || [],
          }
        : {
            ...group,
            members: [],
          };
    });
  }, [basicGroups, groupsWithMembers]);

  // Modify the useEffect that processes the data to include filtering
  useEffect(() => {
    if (combinedGroups && combinedGroups.length > 0) {
      // Apply filters
      const filtered = combinedGroups.filter((group) => {
        // Search text filter (match group name or description)
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : group.groupName?.toLowerCase().includes(searchText.toLowerCase());

        // Group type filter
        const matchesType =
          typeFilter === "all"
            ? true
            : group.groupType?.toString() === typeFilter;

        // Status filter
        const matchesStatus =
          statusFilter === "all"
            ? true
            : group.status?.toString() === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      });

      // Sort groups (newest first based on creation date)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Update the current page when filters change
      setCurrentPage(1);

      // Update the filtered groups list - replace this with your pagination logic
      const paginatedGroups = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      // Update the filteredGroups state
      setFilteredGroups(filtered);
    }
  }, [combinedGroups, searchText, typeFilter, statusFilter]);

  // Update the paginatedGroups calculation to use the filtered array:
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Then calculate paginated groups from the filtered array:
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  const { data: lecturersData, isLoading: isLoadingLecturers } =
    useGetLecturersQuery();
  const { data: studentsData, isLoading: isLoadingStudents } =
    useGetStudentsQuery();
  const { data: academicUsers, isLoading: isLoadingAcademicUsers } =
    useGetAcademicUsersQuery();

  const [reInviteMember, { isLoading: isReInviting }] =
    useReInviteGroupMemberMutation();

  const handleAcceptInvitation = (groupId) => {
    message.success("Invitation accepted successfully!");
  };

  const handleRejectInvitation = (groupId) => {
    message.info("Invitation rejected");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1: // Active/Accepted
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
      case 1: // Active/Accepted
        return <CheckCircleOutlined className="text-green-500" />;
      case 0: // Pending
        return <ClockCircleOutlined className="text-yellow-500" />;
      case 3: // Rejected
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getGroupStats = () => {
    if (!combinedGroups || !combinedGroups.length)
      return {
        totalGroups: 0,
        totalMembers: 0,
        acceptedMembers: 0,
        pendingMembers: 0,
      };

    const totalGroups = combinedGroups.length;

    // If members are available
    const hasMembers = combinedGroups.some(
      (group) => group.members && group.members.length > 0
    );

    if (hasMembers) {
      // Filter out stakeholders before counting
      const nonStakeholderMembers = (group) =>
        (group.members || []).filter((m) => m.role !== 6);

      const totalMembers = combinedGroups.reduce(
        (acc, group) => acc + nonStakeholderMembers(group).length,
        0
      );
      const acceptedMembers = combinedGroups.reduce(
        (acc, group) =>
          acc +
          nonStakeholderMembers(group).filter((m) => m.status === 1).length,
        0
      );
      const pendingMembers = combinedGroups.reduce(
        (acc, group) =>
          acc +
          nonStakeholderMembers(group).filter((m) => m.status === 0).length,
        0
      );

      return { totalGroups, totalMembers, acceptedMembers, pendingMembers };
    } else {
      // If no member details are available yet
      return {
        totalGroups,
        totalMembers: 0,
        acceptedMembers: 0,
        pendingMembers: 0,
      };
    }
  };

  const stats = getGroupStats();

  const showGroupDetails = (group) => {
    setIsModalVisible(true);
    setIsModalContentLoading(true);

    // Fetch fresh data when opening the modal
    refetch()
      .then((response) => {
        if (response.data) {
          // Find the updated group with the latest data
          const updatedGroup = response.data.find(
            (g) => g.groupId === group.groupId
          );

          if (updatedGroup) {
            setSelectedGroup(updatedGroup);
          } else {
            // Fallback to the cached data if the updated group can't be found
            setSelectedGroup(group);
          }

          setIsModalContentLoading(false);
        } else {
          // Use cached data if the refetch fails
          setSelectedGroup(group);
          setIsModalContentLoading(false);
        }
      })
      .catch(() => {
        // Handle error - still show the modal with cached data
        setSelectedGroup(group);
        setIsModalContentLoading(false);
      });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedGroup(null);
  };

  useEffect(() => {
    if (!emailInput) {
      setAutoCompleteOptions([]);
      return;
    }

    const inputLower = emailInput.toLowerCase();
    const isResearchGroup = selectedGroupForInvite?.groupType === 2;

    // For supervisor role (2), show lecturers
    if (selectedRole === 2 && lecturersData?.lecturers) {
      const filteredLecturers = lecturersData.lecturers.filter(
        (lecturer) =>
          (lecturer.email.toLowerCase().includes(inputLower) ||
            lecturer.fullName.toLowerCase().includes(inputLower)) &&
          // Exclude current user
          lecturer.userId !== userId &&
          lecturer.email.toLowerCase() !== currentUser?.email?.toLowerCase()
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
        user: lecturer,
      }));

      setAutoCompleteOptions(options);
    }
    // For Research groups (groupType 2), show both students and academics for member roles
    else if (
      isResearchGroup &&
      (selectedRole === 0 || selectedRole === 1) &&
      academicUsers
    ) {
      const filteredUsers = academicUsers.allUsers.filter(
        (user) =>
          (user.email.toLowerCase().includes(inputLower) ||
            user.fullName.toLowerCase().includes(inputLower)) &&
          // Exclude current user
          user.userId !== userId &&
          user.email.toLowerCase() !== currentUser?.email?.toLowerCase()
      );

      const options = filteredUsers.map((user) => ({
        value: user.email,
        label: (
          <div className="flex items-center space-x-2">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className={
                user.userType === "Lecturer" || user.userType === "Researcher"
                  ? "bg-blue-500"
                  : "bg-orange-500"
              }
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium">{user.fullName}</span>
                <Tag
                  color={
                    user.userType === "Lecturer" ||
                    user.userType === "Researcher"
                      ? "blue"
                      : "orange"
                  }
                  className="ml-2 text-xs px-1 py-0"
                >
                  {user.userType}
                </Tag>
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        ),
        user: user,
      }));

      setAutoCompleteOptions(options);
    }
    // For student roles (0 or 1) in non-research groups, show only students
    else if ((selectedRole === 0 || selectedRole === 1) && studentsData) {
      const filteredStudents = studentsData.filter(
        (student) =>
          (student.email.toLowerCase().includes(inputLower) ||
            student.fullName.toLowerCase().includes(inputLower)) &&
          // Exclude current user
          student.userId !== userId &&
          student.email.toLowerCase() !== currentUser?.email?.toLowerCase()
      );

      const options = filteredStudents.map((student) => ({
        value: student.email,
        label: (
          <div className="flex items-center space-x-2">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-orange-500"
            />
            <div className="flex flex-col">
              <div className="font-medium">{student.fullName}</div>
              <div className="text-xs text-gray-500">{student.email}</div>
            </div>
          </div>
        ),
        user: student,
      }));

      setAutoCompleteOptions(options);
    }
  }, [
    emailInput,
    lecturersData,
    studentsData,
    selectedRole,
    selectedGroupForInvite,
    academicUsers,
    userId,
    currentUser,
  ]);

  const handleInviteMember = (group, role, memberId) => {
    // For Leader role, check if there's already an accepted leader
    const hasAcceptedLeader =
      role === 0 &&
      group.members.some(
        (m) => m.role === 0 && m.status === 1 && m.groupMemberId !== memberId
      );

    if (hasAcceptedLeader) {
      message.warning("This group already has an active leader");
      return;
    }

    setSelectedGroupForInvite(group);
    setSelectedRole(role);
    setIsInviteModalVisible(true);

    // Temporarily close the details modal
    setIsModalVisible(false);
  };

  const handleInviteModalCancel = () => {
    setIsInviteModalVisible(false);
    inviteForm.resetFields();
    setEmailInput("");

    // Reopen the details modal
    setIsModalVisible(true);
  };

  const handleSelectUser = (email, option) => {
    const user = option.user;

    // Update form value when a user is selected
    inviteForm.setFieldsValue({
      email,
      selectedUserId: user.userId,
    });
  };

  const handleInviteSubmit = async (values) => {
    try {
      let selectedUser;

      // Find the selected user based on role and group type
      if (selectedRole === 2) {
        // For supervisor role, always use lecturers
        selectedUser = lecturersData?.lecturers.find(
          (l) => l.email === values.email
        );
      } else if (
        selectedGroupForInvite?.groupType === 2 &&
        (selectedRole === 0 || selectedRole === 1)
      ) {
        // For research groups, member can be student, lecturer or researcher
        selectedUser = academicUsers?.allUsers.find(
          (u) => u.email === values.email
        );
      } else {
        // For regular groups, members are students
        selectedUser = studentsData?.find((s) => s.email === values.email);
      }

      if (!selectedUser) {
        message.error("Please select a valid user");
        return;
      }

      // Get the correct group type name using the helper
      const groupTypeName = getGroupTypeName(
        selectedGroupForInvite.groupType
      ).toLowerCase();

      // Prepare the request body
      const reInviteData = {
        groupId: selectedGroupForInvite.groupId,
        memberEmail: selectedUser.email,
        memberName: selectedUser.fullName,
        role: selectedRole,
        message: `You have been invited to join the ${
          selectedGroupForInvite.groupName
        } ${groupTypeName} group as a ${
          selectedRole === 0
            ? "Leader"
            : selectedRole === 1
            ? "Member"
            : "Supervisor"
        }.`,
      };

      // Call the API
      await reInviteMember(reInviteData).unwrap();

      message.success(`Invitation sent to ${selectedUser.fullName}`);

      // Close invite modal
      setIsInviteModalVisible(false);

      // Reset form
      inviteForm.resetFields();
      setEmailInput("");

      // Refetch the data to show updated group info
      await refetch();

      // Show loading indicator in modal
      setIsModalContentLoading(true);

      // Reopen details modal with loading indicator
      setIsModalVisible(true);

      // Fetch fresh data when opening the modal
      refetch()
        .then((response) => {
          if (response.data) {
            // Find the updated group with the latest data
            const updatedGroup = response.data.find(
              (g) => g.groupId === selectedGroupForInvite.groupId
            );

            if (updatedGroup) {
              setSelectedGroup(updatedGroup);
            } else {
              // Fallback to the cached data if the updated group can't be found
              setSelectedGroup(selectedGroupForInvite);
            }

            setIsModalContentLoading(false);
          } else {
            // Use cached data if the refetch fails
            setSelectedGroup(selectedGroupForInvite);
            setIsModalContentLoading(false);
          }
        })
        .catch(() => {
          // Handle error - still show the modal with cached data
          setSelectedGroup(selectedGroupForInvite);
          setIsModalContentLoading(false);
        });
    } catch (error) {
      message.error(
        "Failed to send invitation: " + (error.data?.message || "Unknown error")
      );
    }
  };

  const handleReviewProject = (group) => {
    // Navigate to the PendingRequest page
    window.location.href = "/review-project";

    // Alternatively, if you're using react-router-dom:
    // navigate('/pending-request');
  };

  const renderMembersList = (members) => {
    // Group members by role for better organization
    // Handle both regular groups and council groups
    const leaders = members.filter((m) => m.role === 0 || m.role === 3);
    const secretaries = members.filter((m) => m.role === 4);
    const supervisors = members.filter((m) => m.role === 2);
    const regularMembers = members.filter((m) => m.role === 1 || m.role === 5);
    const stakeholders = members.filter((m) => m.role === 6); // Filter for stakeholders

    // Function to render a single member with appropriate styling
    const renderMember = (member) => {
      // Check if this role already has an accepted member
      const hasAcceptedMemberWithSameRole = selectedGroup.members.some(
        (m) =>
          m.role === member.role &&
          m.status === 1 &&
          m.groupMemberId !== member.groupMemberId
      );

      // Special check for leader roles
      const isLeaderRole = member.role === 0 || member.role === 3;
      const hasAcceptedLeader =
        isLeaderRole &&
        selectedGroup.members.some(
          (m) =>
            (m.role === 0 || m.role === 3) &&
            m.status === 1 &&
            m.groupMemberId !== member.groupMemberId
        );

      // Update the tooltip message
      const tooltipMessage = isLeaderRole
        ? "This group already has a leader"
        : "This position has already been filled by another member";

      // Special handling for Stakeholder
      if (member.role === 6) {
        return (
          <List.Item key={member.groupMemberId}>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: "#78716c", // Neutral color for stakeholder
                    border:
                      getStatusColor(member.status) === "success"
                        ? "2px solid #52c41a"
                        : getStatusColor(member.status) === "warning"
                        ? "2px solid #faad14"
                        : "2px solid #ff4d4f",
                  }}
                >
                  S
                </Avatar>
              }
              title={
                <div className="flex justify-between items-center">
                  <Space>
                    {/* Display only email for stakeholder */}
                    <Text strong>{member.memberEmail}</Text>
                    <Tag color="gray">Stakeholder</Tag>
                  </Space>
                  <Tag
                    icon={getStatusIcon(member.status)}
                    color={getStatusColor(member.status)}
                  >
                    {member.statusString}
                  </Tag>
                </div>
              }
              description={
                // No description or replace button needed for stakeholder
                null
              }
            />
          </List.Item>
        );
      }

      // Existing rendering logic for other roles
      return (
        <List.Item key={member.groupMemberId}>
          <List.Item.Meta
            avatar={
              <Avatar
                style={{
                  backgroundColor:
                    member.role === 0 || member.role === 3
                      ? "#1890ff" // Leader/Chairman - blue
                      : member.role === 2
                      ? "#52c41a" // Supervisor - green
                      : member.role === 4
                      ? "#722ed1" // Secretary - purple
                      : "#f56a00", // Member/Council Member - orange
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
                      member.role === 0 || member.role === 3
                        ? "blue"
                        : member.role === 2
                        ? "green"
                        : member.role === 4
                        ? "purple"
                        : "orange"
                    }
                  >
                    {member.roleString}
                  </Tag>
                </Space>
                <Tag
                  icon={getStatusIcon(member.status)}
                  color={getStatusColor(member.status)}
                >
                  {member.statusString}
                </Tag>
              </div>
            }
            description={
              <div className="flex justify-between items-center">
                <Text type="secondary">{member.memberEmail}</Text>
                {member.status === 3 &&
                  !(hasAcceptedMemberWithSameRole || hasAcceptedLeader) && (
                    <Button
                      icon={<UserAddOutlined />}
                      onClick={() =>
                        handleInviteMember(
                          selectedGroup,
                          member.role,
                          member.groupMemberId
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
                {member.status === 3 &&
                  (hasAcceptedMemberWithSameRole || hasAcceptedLeader) && (
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
        {leaders.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <Text strong className="text-blue-500">
                {leaders[0].role === 0 ? "Leader" : "Chairman"}
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={leaders}
              renderItem={renderMember}
              className="bg-blue-50 rounded-lg p-2"
            />
          </div>
        )}

        {secretaries.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <Text strong className="text-purple-500">
                Secretary
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={secretaries}
              renderItem={renderMember}
              className="bg-purple-50 rounded-lg p-2"
            />
          </div>
        )}

        {supervisors.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <Text strong className="text-green-500">
                Supervisors
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={supervisors}
              renderItem={renderMember}
              className="bg-green-50 rounded-lg p-2"
            />
          </div>
        )}

        {regularMembers.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <Text strong className="text-orange-500">
                {regularMembers[0].role === 1 ? "Members" : "Council Members"}
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={regularMembers}
              renderItem={renderMember}
              className="bg-orange-50 rounded-lg p-2"
            />
          </div>
        )}

        {stakeholders.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
              <Text strong className="text-gray-500">
                Stakeholders
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={stakeholders}
              renderItem={renderMember} // Use the updated renderMember function
              className="bg-gray-100 rounded-lg p-2" // Use a neutral background
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
          title: "Total Groups",
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

  // Enhanced Group Cards Skeleton with animated gradient
  const GroupCardsSkeleton = () => (
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

  // Group details modal skeleton
  const GroupDetailsSkeleton = () => (
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
              Group Type
            </Text>
          }
        >
          <Skeleton.Input style={{ width: 120 }} active size="small" />
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

        {/* Add Department and Expertises to skeleton */}
        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Department
            </Text>
          }
        >
          <Skeleton.Input style={{ width: 160 }} active size="small" />
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Areas of Expertise
            </Text>
          }
        >
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton.Button
                key={i}
                active
                style={{ width: 100, height: 22 }}
                className="mr-2"
              />
            ))}
          </div>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Text strong className="opacity-50">
              Members
            </Text>
          }
        >
          {/* Rest of the skeleton code */}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  // 1. First add a utility function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
                My Research Groups
              </h2>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              View and manage your research group collaborations
            </p>
          </div>

          {/* Statistics Cards Skeleton */}
          <StatisticsSkeleton />

          {/* Group Cards Skeleton */}
          <GroupCardsSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <Result
          status="error"
          title="Failed to load research groups"
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
              My Research Groups
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your research group collaborations
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Groups
                  </span>
                }
                value={stats.totalGroups}
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

        {/* Search and Filter Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Groups
              </label>
              <Input
                placeholder="Search by group name..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
                prefix={<SearchOutlined className="text-gray-400" />}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Type
              </label>
              <Select
                placeholder="Filter by type"
                onChange={setTypeFilter}
                value={typeFilter}
                className="w-full"
                disabled={isLoading}
              >
                <Select.Option value="all">All Types</Select.Option>
                <Select.Option value="0">Student Group</Select.Option>
                <Select.Option value="1">Research Council</Select.Option>
                <Select.Option value="2">Research Group</Select.Option>
                <Select.Option value="3">Inspection Council</Select.Option>
                <Select.Option value="4">Assessment Council</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                placeholder="Filter by status"
                onChange={setStatusFilter}
                value={statusFilter}
                className="w-full"
                disabled={isLoading}
              >
                <Select.Option value="all">All Statuses</Select.Option>
                <Select.Option value="0">Pending</Select.Option>
                <Select.Option value="1">Active</Select.Option>
                <Select.Option value="2">Inactive</Select.Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Groups List with Pagination */}
        {!combinedGroups || combinedGroups.length === 0 ? (
          <Empty
            description="No research groups found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
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
              dataSource={paginatedGroups}
              renderItem={(group) => {
                // Only count non-stakeholder, non-rejected members for acceptance
                const relevantMembers = group.members.filter(
                  (m) => m.role !== 6 && m.status !== 3
                );
                const acceptedRelevantMembers = relevantMembers.filter(
                  (m) => m.status === 1
                );
                const progressPercent =
                  relevantMembers.length > 0
                    ? Math.round(
                        (acceptedRelevantMembers.length /
                          relevantMembers.length) *
                          100
                      )
                    : 0; // Handle division by zero if no relevant members

                return (
                  <List.Item>
                    <Card
                      className="hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
                      title={
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <Text strong className="text-lg truncate block">
                              {group.groupName}
                            </Text>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Tag
                              color={
                                group.groupType === 0
                                  ? "blue"
                                  : group.groupType === 1
                                  ? "purple"
                                  : group.groupType === 2
                                  ? "cyan"
                                  : group.groupType === 3
                                  ? "green"
                                  : group.groupType === 4
                                  ? "volcano"
                                  : "default"
                              }
                              className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                              {group.groupTypeString || "Unknown Type"}
                            </Tag>
                            <Tag
                              color={GROUP_STATUS_COLORS[group.status ?? 1]}
                              icon={getGroupStatusIcon(group.status ?? 1)}
                              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                              {GROUP_STATUS[group.status ?? 1]}
                            </Tag>
                            {(group.groupType === 1 || // Review Council
                              group.groupType === 3 || // Inspection Council
                              group.groupType === 4) && ( // Assessment Council
                              <Tooltip title="View Schedule">
                                <Button
                                  type="text"
                                  shape="circle"
                                  icon={
                                    <CalendarOutlined className="text-blue-500 hover:text-blue-700" />
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    navigate(
                                      `/review-schedule?councilGroupId=${group.groupId}`
                                    );
                                  }}
                                  className="ml-2"
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      }
                      actions={[
                        <Button
                          type="primary"
                          onClick={() => showGroupDetails(group)}
                          className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                        >
                          View Details
                        </Button>,
                        (group.groupType === 1 || // Review Council
                          group.groupType === 3 || // Inspection Council
                          group.groupType === 4) && // Assessment Council
                          null, // Removed the button from actions
                        group.groupType === 1 ||
                        group.groupType === 3 ||
                        group.groupType === 4 ? (
                          <Button
                            type="primary"
                            onClick={() => handleReviewProject(group)} // This likely navigates to a page to manage/review specific projects for that council
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
                            icon={<BookOutlined />}
                          >
                            Review Projects
                          </Button>
                        ) : null,
                      ].filter(Boolean)}
                    >
                      <div className="space-y-4">
                        {/* Display department if available */}
                        {group.departmentName && (
                          <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center">
                              <BankOutlined className="text-blue-500 mr-2" />
                              <Text strong>{group.departmentName}</Text>
                            </div>
                          </div>
                        )}

                        {/* Display expertises when available */}
                        {group.expertises && group.expertises.length > 0 && (
                          <div>
                            <Text type="secondary" className="block mb-1">
                              Areas of Expertise:
                            </Text>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {group.expertises.map((expertise, index) => (
                                <Tag key={index} color="blue" className="mb-1">
                                  {expertise}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between mb-2">
                            <Text type="secondary">Member Acceptance</Text>
                            <Text
                              strong
                            >{`${acceptedRelevantMembers.length}/${relevantMembers.length}`}</Text>
                          </div>
                          <Progress
                            percent={progressPercent}
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
                            {group.members.some(
                              (m) => m.role === 0 || m.role === 3
                            ) && (
                              <Tooltip
                                title={
                                  group.members.some((m) => m.role === 3)
                                    ? "Chairman"
                                    : "Leader"
                                }
                              >
                                <Avatar className="bg-blue-500">
                                  {group.members.some((m) => m.role === 3)
                                    ? "C"
                                    : "L"}
                                </Avatar>
                              </Tooltip>
                            )}
                            {group.members.some((m) => m.role === 4) && (
                              <Tooltip title="Secretary">
                                <Avatar className="bg-purple-500">S</Avatar>
                              </Tooltip>
                            )}
                            {group.members.some((m) => m.role === 2) && (
                              <Tooltip title="Supervisor">
                                <Avatar className="bg-green-500">S</Avatar>
                              </Tooltip>
                            )}
                            <Tooltip
                              title={`${
                                group.members.some((m) => m.role === 5)
                                  ? "Council "
                                  : ""
                              }Members (${
                                group.members.filter(
                                  (m) => m.role === 1 || m.role === 5
                                ).length
                              })`}
                            >
                              <Avatar className="bg-orange-500">
                                {
                                  group.members.filter(
                                    (m) => m.role === 1 || m.role === 5
                                  ).length
                                }
                              </Avatar>
                            </Tooltip>
                          </div>

                          <Space>
                            <Badge
                              status="success"
                              text={
                                <Text type="secondary">
                                  {`${acceptedRelevantMembers.length} of ${relevantMembers.length} Members`}
                                </Text>
                              }
                            />
                          </Space>
                        </div>

                        {/* Status indicators */}
                        <div className="flex flex-wrap gap-2">
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            {
                              group.members.filter(
                                (m) => m.status === 1 && m.role !== 6
                              ).length
                            }{" "}
                            Accepted
                          </Tag>
                          <Tag color="warning" icon={<ClockCircleOutlined />}>
                            {
                              group.members.filter(
                                (m) => m.status === 0 && m.role !== 6
                              ).length
                            }{" "}
                            Pending
                          </Tag>
                          <Tag color="error" icon={<CloseCircleOutlined />}>
                            {
                              group.members.filter(
                                (m) => m.status === 3 && m.role !== 6
                              ).length
                            }{" "}
                            Rejected
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />

            {/* Pagination Component */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredGroups.length}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={[6, 9, 12, 18]}
                showTotal={(total) => `Total ${total} groups`}
              />
            </div>
          </>
        )}

        {/* Group Details Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <Text strong className="text-xl">
                {selectedGroup ? selectedGroup.groupName : "Group Details"}
              </Text>
              {selectedGroup && (
                <Tag
                  color={GROUP_STATUS_COLORS[selectedGroup.status ?? 1]}
                  icon={getGroupStatusIcon(selectedGroup.status ?? 1)}
                >
                  {GROUP_STATUS[selectedGroup.status ?? 1]}
                </Tag>
              )}
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
          className="group-details-modal"
        >
          <div className="space-y-6">
            {isModalContentLoading ? (
              <GroupDetailsSkeleton />
            ) : (
              selectedGroup && (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label={<Text strong>Created Date</Text>}>
                    {new Date(selectedGroup.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text strong>Group Type</Text>}>
                    <Tag
                      color={
                        selectedGroup.groupType === 0
                          ? "blue"
                          : selectedGroup.groupType === 1
                          ? "purple"
                          : selectedGroup.groupType === 2
                          ? "cyan"
                          : selectedGroup.groupType === 3
                          ? "green"
                          : selectedGroup.groupType === 4
                          ? "volcano"
                          : "default"
                      }
                    >
                      {selectedGroup.groupTypeString}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text strong>Status</Text>}>
                    <Tag
                      color={GROUP_STATUS_COLORS[selectedGroup.status ?? 1]}
                      icon={getGroupStatusIcon(selectedGroup.status ?? 1)}
                    >
                      {GROUP_STATUS[selectedGroup.status ?? 1]}
                    </Tag>
                  </Descriptions.Item>

                  {/* Add department display if available */}
                  {selectedGroup.departmentName && (
                    <Descriptions.Item label={<Text strong>Department</Text>}>
                      {selectedGroup.departmentName}
                    </Descriptions.Item>
                  )}

                  {/* Add expertises display if available */}
                  {selectedGroup.expertises &&
                    selectedGroup.expertises.length > 0 && (
                      <Descriptions.Item
                        label={<Text strong>Areas of Expertise</Text>}
                      >
                        <div className="flex flex-wrap gap-2">
                          {selectedGroup.expertises.map((expertise, index) => (
                            <Tag key={index} color="blue">
                              {expertise}
                            </Tag>
                          ))}
                        </div>
                      </Descriptions.Item>
                    )}

                  <Descriptions.Item label={<Text strong>Members</Text>}>
                    {renderMembersList(selectedGroup.members)}
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
              <span>
                Replace{" "}
                {selectedRole === 0
                  ? "Leader"
                  : selectedRole === 1
                  ? "Member"
                  : "Supervisor"}
                {selectedGroupForInvite?.groupType === 2 &&
                  (selectedRole === 0 || selectedRole === 1) &&
                  " (Students, Lecturers, or Researchers)"}
              </span>
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
                  You are replacing{" "}
                  {selectedRole === 0
                    ? "a Leader"
                    : selectedRole === 1
                    ? "a Member"
                    : "a Supervisor"}{" "}
                  who declined their invitation.
                </Text>
              </div>

              <Form.Item
                label={
                  selectedRole === 2
                    ? "New Supervisor"
                    : selectedGroupForInvite?.groupType === 2 &&
                      (selectedRole === 0 || selectedRole === 1)
                    ? `New ${
                        selectedRole === 0 ? "Leader" : "Member"
                      } (Student, Lecturer, or Researcher)`
                    : "New Member"
                }
                name="email"
                rules={[
                  {
                    required: true,
                    message: `Please select a ${
                      selectedRole === 2
                        ? "lecturer"
                        : selectedGroupForInvite?.groupType === 2 &&
                          (selectedRole === 0 || selectedRole === 1)
                        ? "user"
                        : "student"
                    }`,
                  },
                ]}
              >
                <AutoComplete
                  value={emailInput}
                  options={autoCompleteOptions}
                  onSelect={handleSelectUser}
                  onChange={setEmailInput}
                  onSearch={setEmailInput}
                  style={{ width: "100%" }}
                  notFoundContent={
                    emailInput ? (
                      <div className="p-3 text-gray-500 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <SearchOutlined className="text-gray-300 text-xl mb-2" />
                          <span>
                            No{" "}
                            {selectedRole === 2
                              ? "lecturers"
                              : selectedGroupForInvite?.groupType === 2 &&
                                (selectedRole === 0 || selectedRole === 1)
                              ? "users"
                              : "students"}{" "}
                            found
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-gray-500 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <TeamOutlined className="text-gray-300 text-xl mb-2" />
                          <span>
                            Type to search for{" "}
                            {selectedRole === 2
                              ? "lecturers"
                              : selectedGroupForInvite?.groupType === 2 &&
                                (selectedRole === 0 || selectedRole === 1)
                              ? "users (students, lecturers, or researchers)"
                              : "students"}
                          </span>
                        </div>
                      </div>
                    )
                  }
                >
                  <Input
                    className="rounded-lg py-2"
                    style={{ paddingLeft: "40px" }}
                    placeholder={
                      selectedRole === 2
                        ? `Search for lecturers by name or email`
                        : selectedGroupForInvite?.groupType === 2 &&
                          (selectedRole === 0 || selectedRole === 1)
                        ? `Search for students, lecturers, or researchers by name or email`
                        : `Search for students by name or email`
                    }
                    suffix={
                      (
                        selectedRole === 2
                          ? isLoadingLecturers
                          : selectedGroupForInvite?.groupType === 2 &&
                            (selectedRole === 0 || selectedRole === 1)
                          ? isLoadingAcademicUsers
                          : isLoadingStudents
                      ) ? (
                        <Spin size="small" />
                      ) : null
                    }
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

              {/* Add a hidden field to store the selected user ID */}
              <Form.Item name="selectedUserId" hidden={true}>
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

export default ViewGroup;
