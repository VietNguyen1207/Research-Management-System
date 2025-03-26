import React, { useState } from "react";
import {
  List,
  Typography,
  Button,
  Badge,
  Empty,
  Tabs,
  Spin,
  Avatar,
} from "antd";
import {
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationDropdown = ({
  notifications = [],
  onAccept,
  onDecline,
  onMarkAsRead,
}) => {
  const [loading, setLoading] = useState(false);

  // Filter unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "invitation":
        return (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-start gap-3">
              <Avatar
                size={40}
                icon={
                  notification.groupType === "research" ? (
                    <TeamOutlined />
                  ) : (
                    <BankOutlined />
                  )
                }
                className={`${
                  notification.groupType === "research"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                } shadow-lg`}
              />
              <div className="flex-1">
                <div className="flex flex-col">
                  <Typography.Text strong className="text-base">
                    New Invitation
                  </Typography.Text>
                  <Typography.Text className="text-gray-600">
                    <span className="font-semibold text-orange-600">
                      {notification.sender}
                    </span>{" "}
                    invited you to join{" "}
                    <span className="font-semibold text-orange-600">
                      {notification.groupName}
                    </span>{" "}
                    as{" "}
                    <span className="font-semibold text-orange-600">
                      {notification.role}
                    </span>
                  </Typography.Text>
                  <Typography.Text className="text-xs text-gray-400 mt-2">
                    {dayjs(notification.timestamp).fromNow()}
                  </Typography.Text>
                </div>
              </div>
            </div>
            {!notification.responded && (
              <div className="flex gap-2 justify-end mt-1">
                <Button
                  size="middle"
                  className="hover:bg-red-50 hover:text-red-600 transition-all"
                  icon={<CloseCircleOutlined />}
                  onClick={() => onDecline(notification.id)}
                >
                  Decline
                </Button>
                <Button
                  size="middle"
                  type="primary"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-md"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onAccept(notification.id)}
                >
                  Accept
                </Button>
              </div>
            )}
          </div>
        );

      case "update":
        return (
          <div className="flex items-start gap-3">
            <Avatar
              size={40}
              icon={<ClockCircleOutlined />}
              className="bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
            />
            <div className="flex-1">
              <Typography.Text strong className="text-base block mb-1">
                {notification.title}
              </Typography.Text>
              <Typography.Text className="text-gray-600 block">
                {notification.message}
              </Typography.Text>
              <Typography.Text className="text-xs text-gray-400 mt-2 block">
                {dayjs(notification.timestamp).fromNow()}
              </Typography.Text>
            </div>
          </div>
        );

      case "response":
        return (
          <div className="flex items-start gap-3">
            <Avatar
              size={40}
              icon={<UserAddOutlined />}
              className={`shadow-lg ${
                notification.accepted
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            />
            <div className="flex-1">
              <Typography.Text strong className="text-base block mb-1">
                Response Received
              </Typography.Text>
              <Typography.Text className="text-gray-600 block">
                <span className="font-semibold text-orange-600">
                  {notification.user}
                </span>{" "}
                {notification.accepted ? "accepted" : "declined"} your
                invitation to join{" "}
                <span className="font-semibold text-orange-600">
                  {notification.groupName}
                </span>
              </Typography.Text>
              <Typography.Text className="text-xs text-gray-400 mt-2 block">
                {dayjs(notification.timestamp).fromNow()}
              </Typography.Text>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BellOutlined />
          All
        </span>
      ),
      children: (
        <List
          className="max-h-[400px] overflow-y-auto custom-scrollbar"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`border-b-0 ${
                !item.read ? "bg-orange-50/50" : ""
              } hover:bg-orange-50 transition-all duration-200 p-3`}
            >
              {renderNotificationContent(item)}
            </List.Item>
          )}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notifications"
              />
            ),
          }}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <Badge
            count={unreadNotifications.length}
            size="small"
            className="animate-pulse"
            style={{
              backgroundColor: "#f97316",
              boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.1)",
            }}
          >
            <span className="mr-2">Unread</span>
          </Badge>
        </span>
      ),
      children: (
        <List
          className="max-h-[400px] overflow-y-auto custom-scrollbar"
          dataSource={unreadNotifications}
          renderItem={(item) => (
            <List.Item className="border-b-0 bg-orange-50/50">
              {renderNotificationContent(item)}
            </List.Item>
          )}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No unread notifications"
              />
            ),
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl w-[420px] border border-orange-100">
      <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-orange-100/50">
        <Typography.Title level={5} className="m-0 flex items-center gap-2">
          <BellOutlined className="text-orange-500" />
          Notifications
        </Typography.Title>
        <Button
          type="link"
          size="small"
          className="text-orange-600 hover:text-orange-700"
          onClick={() => onMarkAsRead()}
        >
          Mark all as read
        </Button>
      </div>
      <Spin spinning={loading}>
        <Tabs
          items={items}
          className="px-2"
          style={{ maxHeight: "600px" }}
          tabBarStyle={{
            marginBottom: 0,
            padding: "0 8px",
          }}
        />
      </Spin>
    </div>
  );
};

export default NotificationDropdown;
