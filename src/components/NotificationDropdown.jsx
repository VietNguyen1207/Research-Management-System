import React, { useState, useEffect } from "react";
import {
  List,
  Typography,
  Button,
  Badge,
  Empty,
  Tabs,
  Spin,
  Avatar,
  message,
  Tooltip,
} from "antd";
import {
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../features/notification/notificationApiSlice";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "../features/invitation/invitationApiSlice";
import { useNotificationCount } from "./Header";

dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  // Add CSS styles for read transition
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .notification-read-transition {
        background-color: rgba(235, 250, 235, 0.5) !important;
        transition: background-color 0.6s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const [markingReadId, setMarkingReadId] = useState(null); // Track which notification is being marked as read

  // Use the shared notification hook instead of a separate query
  const { notifications, unreadCount, isLoading, isError, refetch } =
    useNotificationCount(userId);
  const [sortedNotifications, setSortedNotifications] = useState([]);
  const [sortedUnreadNotifications, setSortedUnreadNotifications] = useState(
    []
  );

  // Remove these as they're now provided by the hook
  // const isLoading = false;
  // const isError = false;
  // const refetch = () => {};

  // Update sorted notifications whenever they change
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Sort notifications by timestamp (newest first)
      const sorted = [...notifications].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setSortedNotifications(sorted);

      // Sort unread notifications by timestamp (newest first)
      const unreadSorted = sorted.filter((n) => !n.read);
      setSortedUnreadNotifications(unreadSorted);
    } else {
      setSortedNotifications([]);
      setSortedUnreadNotifications([]);
    }
  }, [notifications]);

  // Mutations
  const [acceptInvitation, { isLoading: isAcceptingInvitation }] =
    useAcceptInvitationMutation();
  const [rejectInvitation, { isLoading: isRejectingInvitation }] =
    useRejectInvitationMutation();
  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] =
    useMarkAllNotificationsAsReadMutation();
  const [markAsRead, { isLoading: isMarkingAsRead }] =
    useMarkNotificationAsReadMutation();

  // Handle accept invitation
  const handleAccept = async (invitationId, notificationId, e) => {
    e.stopPropagation(); // Prevent notification click event
    setMarkingReadId(notificationId);
    try {
      // Call the accept invitation API
      await acceptInvitation(invitationId).unwrap();
      message.success("Invitation accepted successfully");
      // Force refetch to get updated notification messages/statuses
      await refetch();
    } catch (error) {
      message.error("Failed to accept invitation");
      console.error("Accept invitation error:", error);
    } finally {
      setMarkingReadId(null);
    }
  };

  // Handle decline invitation
  const handleDecline = async (invitationId, notificationId, e) => {
    e.stopPropagation(); // Prevent notification click event
    setMarkingReadId(notificationId);
    try {
      // Call the reject invitation API
      await rejectInvitation(invitationId).unwrap();
      message.success("Invitation declined");
      // Force refetch to get updated notification messages/statuses
      await refetch();
    } catch (error) {
      message.error("Failed to decline invitation");
      console.error("Decline invitation error:", error);
    } finally {
      setMarkingReadId(null);
    }
  };

  // Handle mark single notification as read
  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) return;

    // Don't mark as read if it's already read
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && notification.read) return;

    setMarkingReadId(notificationId);
    try {
      await markAsRead(notificationId).unwrap();
      // No need to update local state as the API refetch will handle it

      // Add a subtle animation by applying and removing a CSS class
      const notificationElement = document.getElementById(
        `notification-${notificationId}`
      );
      if (notificationElement) {
        notificationElement.classList.add("notification-read-transition");
        setTimeout(() => {
          notificationElement.classList.remove("notification-read-transition");
        }, 600);
      }

      // Refetch to get updated notification list
      refetch();
    } catch (error) {
      console.error("Mark as read error:", error);
    } finally {
      setMarkingReadId(null);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!userId) return;

    try {
      await markAllAsRead(userId).unwrap();
      // No need to set unreadCount to zero - refetch will update it
      message.success("All notifications marked as read");
      refetch();
    } catch (error) {
      message.error("Failed to mark notifications as read");
      console.error("Mark all as read error:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  // Determine if a notification is a pending invitation
  const isPendingInvitation = (notification) => {
    return (
      notification.type === "invitation" &&
      notification.status === 0 &&
      notification.invitationId
    );
  };

  // Determine notification response type
  const getNotificationResponseStatus = (notification) => {
    if (notification.status === 1) {
      return "accepted";
    } else if (notification.status === 2) {
      return "declined";
    } else {
      return null;
    }
  };

  // Render read status icon
  const renderReadStatus = (notification) => {
    // Show loading spinner when this specific notification is being marked as read
    if (markingReadId === notification.id) {
      return <Spin size="small" className="ml-2" />;
    }

    // For already read notifications
    if (notification.read) {
      return (
        <Tooltip title="Read">
          <CheckOutlined
            className="text-green-500 ml-2"
            style={{ fontSize: "14px" }}
          />
        </Tooltip>
      );
    }
    return null;
  };

  const renderNotificationContent = (notification) => {
    // Determine if the notification is a pending invitation or a response
    const isPending = isPendingInvitation(notification);
    const responseStatus = getNotificationResponseStatus(notification);

    // For invitation-type notifications
    if (notification.type === "invitation") {
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
                isPending
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : responseStatus === "accepted"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              } shadow-lg`}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Typography.Text strong className="text-base">
                    {isPending ? "New Invitation" : "Invitation Response"}
                  </Typography.Text>
                  {renderReadStatus(notification)}
                </div>
                <Typography.Text className="text-gray-600">
                  {notification.message}
                </Typography.Text>
                <Typography.Text className="text-xs text-gray-400 mt-2">
                  {dayjs(notification.timestamp).fromNow()}
                </Typography.Text>
              </div>
            </div>
          </div>
          {/* Only show accept/decline buttons for pending invitations */}
          {isPending && (
            <div className="flex gap-2 justify-end mt-1">
              <Button
                size="middle"
                className="hover:bg-red-50 hover:text-red-600 transition-all"
                icon={<CloseCircleOutlined />}
                onClick={(e) =>
                  handleDecline(notification.invitationId, notification.id, e)
                }
                loading={
                  isRejectingInvitation && markingReadId === notification.id
                }
              >
                Decline
              </Button>
              <Button
                size="middle"
                type="primary"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-md"
                icon={<CheckCircleOutlined />}
                onClick={(e) =>
                  handleAccept(notification.invitationId, notification.id, e)
                }
                loading={
                  isAcceptingInvitation && markingReadId === notification.id
                }
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      );
    }

    // For update notifications
    if (notification.type === "update") {
      return (
        <div className="flex items-start gap-3">
          <Avatar
            size={40}
            icon={<ClockCircleOutlined />}
            className="bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <Typography.Text strong className="text-base block mb-1">
                {notification.title}
              </Typography.Text>
              {renderReadStatus(notification)}
            </div>
            <Typography.Text className="text-gray-600 block">
              {notification.message}
            </Typography.Text>
            <Typography.Text className="text-xs text-gray-400 mt-2 block">
              {dayjs(notification.timestamp).fromNow()}
            </Typography.Text>
          </div>
        </div>
      );
    }

    // For response notifications
    if (notification.type === "response") {
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
            <div className="flex items-center">
              <Typography.Text strong className="text-base block mb-1">
                Notification Mark as Read
              </Typography.Text>
              {renderReadStatus(notification)}
            </div>
            <Typography.Text className="text-gray-600 block">
              {notification.message}
            </Typography.Text>
            <Typography.Text className="text-xs text-gray-400 mt-2 block">
              {dayjs(notification.timestamp).fromNow()}
            </Typography.Text>
          </div>
        </div>
      );
    }

    return null;
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
          dataSource={sortedNotifications}
          renderItem={(item) => (
            <List.Item
              id={`notification-${item.id}`}
              className={`border-b-0 ${!item.read ? "bg-orange-50/50" : ""} ${
                markingReadId === item.id ? "opacity-70" : ""
              } hover:bg-orange-50 transition-all duration-200 p-3 cursor-pointer`}
              onClick={() => handleNotificationClick(item)}
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
            count={unreadCount}
            size="small"
            className="animate-pulse"
            style={{
              backgroundColor: "#f97316",
              boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.1)",
            }}
            overflowCount={99}
          >
            <span className="mr-2">Unread</span>
          </Badge>
        </span>
      ),
      children: (
        <List
          className="max-h-[400px] overflow-y-auto custom-scrollbar"
          dataSource={sortedUnreadNotifications}
          renderItem={(item) => (
            <List.Item
              id={`notification-${item.id}`}
              className={`border-b-0 bg-orange-50/50 ${
                markingReadId === item.id ? "opacity-70" : ""
              } cursor-pointer`}
              onClick={() => handleNotificationClick(item)}
            >
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
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              size="small"
              className="ml-2"
              style={{ backgroundColor: "#f97316" }}
              overflowCount={99}
            />
          )}
        </Typography.Title>
        <Button
          type="link"
          size="small"
          className="text-orange-600 hover:text-orange-700"
          onClick={handleMarkAllAsRead}
          loading={isMarkingAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>
      <Spin
        spinning={isLoading || isAcceptingInvitation || isRejectingInvitation}
      >
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
