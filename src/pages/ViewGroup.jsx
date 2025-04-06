import React from "react";
import { Card, Tag, Empty, Divider, Button, message, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useGetGroupsByUserQuery } from "../features/group/groupApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";

const ViewGroup = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;

  const {
    data: groups,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetGroupsByUserQuery(userId, {
    skip: !userId,
  });

  const handleAcceptInvitation = (groupId) => {
    message.success("Invitation accepted successfully!");
  };

  const handleRejectInvitation = (groupId) => {
    message.info("Invitation rejected");
  };

  const renderMemberStatus = (status, statusString) => {
    switch (status) {
      case 1: // Active
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {statusString}
          </Tag>
        );
      case 0: // Pending
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            {statusString}
          </Tag>
        );
      case 2: // Inactive
        return (
          <Tag icon={<StopOutlined />} color="error">
            {statusString}
          </Tag>
        );
      case 3: // Rejected
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            {statusString}
          </Tag>
        );
      default:
        return null;
    }
  };

  const renderGroupCard = (group) => (
    <Card
      key={group.groupId}
      className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-200"
      title={
        <div className="flex items-center text-xl font-bold text-gray-800">
          <TeamOutlined className="mr-2 text-[#F2722B]" />
          {group.groupName}
          <Tag
            className="ml-3"
            color={group.groupType === 1 ? "purple" : "blue"}
          >
            {group.groupTypeString}
          </Tag>
        </div>
      }
      extra={
        <div className="flex items-center">
          <Tag color="blue">
            {group.currentMember}/{group.maxMember} Members
          </Tag>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Members Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Group Members
          </h3>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member.groupMemberId}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {member.role === 0 ? (
                    <CrownOutlined className="text-[#F2722B]" />
                  ) : member.role === 2 ? (
                    <UserOutlined className="text-blue-500" />
                  ) : member.role === 3 ? (
                    <UserOutlined className="text-purple-500" />
                  ) : (
                    <UserOutlined className="text-gray-400" />
                  )}
                  <span>{member.memberName}</span>
                  <span className="text-gray-400 text-sm">
                    {member.memberEmail}
                  </span>
                  <Tag
                    color={
                      member.role === 0
                        ? "orange"
                        : member.role === 2
                        ? "blue"
                        : member.role === 3
                        ? "purple"
                        : member.role === 4
                        ? "cyan"
                        : "default"
                    }
                    className="rounded-full"
                  >
                    {member.roleString}
                  </Tag>
                </div>
                {renderMemberStatus(member.status, member.statusString)}
              </div>
            ))}
          </div>
        </div>

        {/* Created Date */}
        <div className="text-gray-400 text-sm">
          Created on: {new Date(group.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spin size="large" tip="Loading groups..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Empty
            description={
              <span className="text-red-500">
                Error loading groups: {error?.message || "Unknown error"}
              </span>
            }
          />
          <Button type="primary" onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Research Groups
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your research group collaborations
          </p>
          {groups && groups.length > 0 && (
            <div className="mt-6 flex justify-center space-x-4">
              <Tag
                icon={<TeamOutlined />}
                className="px-4 py-2 text-base rounded-full border-[#F2722B] text-[#F2722B]"
              >
                Active Groups: {groups.length}
              </Tag>
              <Tag
                icon={<UserOutlined />}
                className="px-4 py-2 text-base rounded-full border-[#F2722B] text-[#F2722B]"
              >
                Total Members:{" "}
                {groups.reduce((acc, group) => acc + group.members.length, 0)}
              </Tag>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {groups && groups.length > 0 ? (
            groups.map(renderGroupCard)
          ) : (
            <Empty
              description={
                <span className="text-gray-500">
                  You haven't joined any research groups yet
                </span>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewGroup;
