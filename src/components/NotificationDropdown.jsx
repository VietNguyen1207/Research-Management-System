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

  // Group notifications by type
  const invitations = notifications.filter((n) => n.type === "invitation");
  const updates = notifications.filter((n) => n.type === "update");
  const responses = notifications.filter((n) => n.type === "response");

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "invitation":
        return (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <Avatar
                icon={
                  notification.groupType === "research" ? (
                    <TeamOutlined />
                  ) : (
                    <BankOutlined />
                  )
                }
                className={
                  notification.groupType === "research"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }
              />
              <div className="flex-1">
                <Typography.Text strong>{notification.sender}</Typography.Text>
                <Typography.Text> invited you to join </Typography.Text>
                <Typography.Text strong>
                  {notification.groupName}
                </Typography.Text>
                <Typography.Text> as </Typography.Text>
                <Typography.Text strong>{notification.role}</Typography.Text>
              </div>
            </div>
            {!notification.responded && (
              <div className="flex gap-2 justify-end">
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => onDecline(notification.id)}
                >
                  Decline
                </Button>
                <Button
                  size="small"
                  type="primary"
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
          <div className="flex items-center gap-2">
            <Avatar icon={<ClockCircleOutlined />} className="bg-orange-500" />
            <div>
              <Typography.Text strong>{notification.title}</Typography.Text>
              <Typography.Text>: {notification.message}</Typography.Text>
            </div>
          </div>
        );

      case "response":
        return (
          <div className="flex items-center gap-2">
            <Avatar
              icon={<UserAddOutlined />}
              className={notification.accepted ? "bg-green-500" : "bg-red-500"}
            />
            <div>
              <Typography.Text strong>{notification.user}</Typography.Text>
              <Typography.Text>
                {notification.accepted ? " accepted " : " declined "}
                your invitation to join
              </Typography.Text>
              <Typography.Text strong>{notification.groupName}</Typography.Text>
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
        <span>
          Invitations
          {invitations.length > 0 && (
            <Badge count={invitations.length} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: (
        <List
          className="max-h-[400px] overflow-y-auto"
          dataSource={invitations}
          renderItem={(item) => (
            <List.Item className={!item.read ? "bg-blue-50" : ""}>
              {renderNotificationContent(item)}
              <Typography.Text className="text-xs text-gray-500 absolute bottom-1 right-2">
                {dayjs(item.timestamp).fromNow()}
              </Typography.Text>
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="No invitations" />,
          }}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span>
          Updates
          {updates.length > 0 && (
            <Badge count={updates.length} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: (
        <List
          className="max-h-[400px] overflow-y-auto"
          dataSource={updates}
          renderItem={(item) => (
            <List.Item className={!item.read ? "bg-blue-50" : ""}>
              {renderNotificationContent(item)}
              <Typography.Text className="text-xs text-gray-500 absolute bottom-1 right-2">
                {dayjs(item.timestamp).fromNow()}
              </Typography.Text>
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="No updates" />,
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Responses",
      children: (
        <List
          className="max-h-[400px] overflow-y-auto"
          dataSource={responses}
          renderItem={(item) => (
            <List.Item className={!item.read ? "bg-blue-50" : ""}>
              {renderNotificationContent(item)}
              <Typography.Text className="text-xs text-gray-500 absolute bottom-1 right-2">
                {dayjs(item.timestamp).fromNow()}
              </Typography.Text>
            </List.Item>
          )}
          locale={{
            emptyText: <Empty description="No responses" />,
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg w-[400px] border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <Typography.Title level={5} className="m-0">
          Notifications
        </Typography.Title>
        <Button type="link" size="small" onClick={() => onMarkAsRead()}>
          Mark all as read
        </Button>
      </div>
      <Spin spinning={loading}>
        <Tabs items={items} className="px-2" style={{ maxHeight: "600px" }} />
      </Spin>
    </div>
  );
};

export default NotificationDropdown;
