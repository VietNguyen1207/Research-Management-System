import React, { useState } from "react";
import {
  Card,
  Tag,
  Button,
  message,
  Modal,
  Select,
  Divider,
  Tooltip,
  Empty,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  DeleteOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { confirm } = Modal;

const ManageGroup = () => {
  // Mock data - replace with API calls later
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "AI Research Group",
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
    },
    {
      id: 2,
      name: "Machine Learning Lab",
      members: [
        {
          email: "mike.brown@university.edu",
          role: "Leader",
          status: "Accepted",
        },
        {
          email: "sarah.lee@university.edu",
          role: "Member",
          status: "Pending",
        },
      ],
    },
  ]);

  const handleApprove = (groupId, memberEmail) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.map((member) =>
              member.email === memberEmail
                ? { ...member, status: "Accepted" }
                : member
            ),
          };
        }
        return group;
      })
    );
    message.success("Member approved successfully");
  };

  const handleReject = (groupId, memberEmail) => {
    confirm({
      title: "Are you sure you want to reject this member?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setGroups(
          groups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                members: group.members.filter(
                  (member) => member.email !== memberEmail
                ),
              };
            }
            return group;
          })
        );
        message.info("Member rejected");
      },
    });
  };

  const handleRemoveMember = (groupId, memberEmail) => {
    confirm({
      title: "Are you sure you want to remove this member?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setGroups(
          groups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                members: group.members.filter(
                  (member) => member.email !== memberEmail
                ),
              };
            }
            return group;
          })
        );
        message.success("Member removed successfully");
      },
    });
  };

  const handleRoleChange = (groupId, memberEmail, newRole) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.map((member) =>
              member.email === memberEmail
                ? { ...member, role: newRole }
                : member
            ),
          };
        }
        return group;
      })
    );
    message.success("Role updated successfully");
  };

  const renderMemberCard = (group, member) => (
    <div
      key={member.email}
      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-3"
    >
      <div className="flex items-center space-x-3">
        {member.role === "Leader" ? (
          <CrownOutlined className="text-[#F2722B]" />
        ) : (
          <UserOutlined className="text-gray-400" />
        )}
        <span className="text-gray-700">{member.email}</span>
        <Select
          value={member.role}
          onChange={(value) => handleRoleChange(group.id, member.email, value)}
          className="w-32"
          disabled={member.status === "Pending"}
        >
          <Option value="Leader">Leader</Option>
          <Option value="Member">Member</Option>
        </Select>
        <Tag
          color={member.status === "Accepted" ? "success" : "warning"}
          className="rounded-full"
        >
          {member.status}
        </Tag>
      </div>
      <div className="flex space-x-2">
        {member.status === "Pending" ? (
          <>
            <Tooltip title="Approve">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(group.id, member.email)}
                className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
              />
            </Tooltip>
            <Tooltip title="Reject">
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(group.id, member.email)}
              />
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Remove Member">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveMember(group.id, member.email)}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Manage Group Members
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Approve new members and manage existing ones
          </p>
        </div>

        <div className="space-y-6">
          {groups.length > 0 ? (
            groups.map((group) => (
              <Card
                key={group.id}
                title={
                  <div className="flex items-center text-xl font-bold text-gray-800">
                    <TeamOutlined className="mr-2 text-[#F2722B]" />
                    {group.name}
                  </div>
                }
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="space-y-4">
                  {group.members.map((member) =>
                    renderMemberCard(group, member)
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Empty description="No groups found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageGroup;
