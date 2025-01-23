import React from "react";
import { Card, Tag, Empty, Divider, Button, message } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const ViewGroup = () => {
  // Mock groups data directly in the component
  const groups = [
    {
      id: 1,
      name: "AI Research Group",
      supervisors: [
        {
          id: 1,
          name: "Dr. Emily Smith",
          email: "emily.smith@university.edu",
        },
      ],
      members: [
        {
          email: "john.doe@university.edu",
          role: "Leader",
          status: "Accepted",
        },
        {
          email: "alice.wong@university.edu",
          role: "Member",
          status: "Accepted",
        },
        {
          email: "bob.wilson@university.edu",
          role: "Member",
          status: "Pending",
        },
      ],
      created_at: "2024-03-15T08:00:00Z",
    },
    {
      id: 2,
      name: "Machine Learning Lab",
      supervisors: [
        {
          id: 2,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@university.edu",
        },
      ],
      members: [
        {
          email: "mike.brown@university.edu",
          role: "Leader",
          status: "Accepted",
        },
        {
          email: "sarah.lee@university.edu",
          role: "Member",
          status: "Accepted",
        },
        {
          email: "david.kim@university.edu",
          role: "Member",
          status: "Pending",
        },
      ],
      created_at: "2024-03-16T09:30:00Z",
    },
  ];

  const handleAcceptInvitation = (groupId) => {
    message.success("Invitation accepted successfully!");
  };

  const handleRejectInvitation = (groupId) => {
    message.info("Invitation rejected");
  };

  const renderMemberStatus = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Accepted
          </Tag>
        );
      case "Pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Pending
          </Tag>
        );
      default:
        return null;
    }
  };

  const renderGroupCard = (group) => (
    <Card
      key={group.id}
      className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-200"
      title={
        <div className="flex items-center text-xl font-bold text-gray-800">
          <TeamOutlined className="mr-2 text-[#F2722B]" />
          {group.name}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Supervisors Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Supervisors
          </h3>
          <div className="space-y-2">
            {group.supervisors.map((supervisor) => (
              <div
                key={supervisor.id}
                className="flex items-center space-x-2 text-gray-600"
              >
                <UserOutlined />
                <span>{supervisor.name}</span>
                <span className="text-gray-400">|</span>
                <MailOutlined />
                <span>{supervisor.email}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Members Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Group Members
          </h3>
          <div className="space-y-2">
            {group.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {member.role === "Leader" ? (
                    <CrownOutlined className="text-[#F2722B]" />
                  ) : (
                    <UserOutlined className="text-gray-400" />
                  )}
                  <span>{member.email}</span>
                  <Tag
                    color={member.role === "Leader" ? "orange" : "default"}
                    className="rounded-full"
                  >
                    {member.role}
                  </Tag>
                </div>
                {renderMemberStatus(member.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Created Date */}
        <div className="text-gray-400 text-sm">
          Created on: {new Date(group.created_at).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );

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
        </div>

        <div className="space-y-6">
          {groups.length > 0 ? (
            groups.map(renderGroupCard)
          ) : (
            <Empty
              description={
                <span className="text-gray-500">
                  No research groups available
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
