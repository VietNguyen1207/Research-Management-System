import React from "react";
import { Alert, Typography, Space, Button } from "antd";
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const ErrorFeedback = ({ error, onClose }) => {
  // Parse the error message to extract key information
  const parseErrorMessage = (message) => {
    if (!message)
      return { title: "Unknown Error", detail: "An unknown error occurred." };

    // Common error patterns and their user-friendly representations
    const errorPatterns = [
      {
        regex: /must have between (\d+) and (\d+) student members/i,
        title: "Incorrect Group Size",
        getMessage: (matches) =>
          `Your group must have between ${matches[1]} and ${matches[2]} student members.`,
        suggestion: (matches) =>
          `Add at least ${matches[1]} student members (and no more than ${matches[2]}) to your group.`,
        icon: <TeamOutlined className="text-amber-500 text-xl" />,
      },
      {
        regex: /max.*?(\d+).*?supervisors/i,
        title: "Too Many Supervisors",
        getMessage: (matches) => `You've selected too many supervisors.`,
        suggestion: (matches) =>
          `Select no more than ${matches[1]} supervisors for your group.`,
        icon: <UserOutlined className="text-amber-500 text-xl" />,
      },
      {
        regex: /group name.*?already exists/i,
        title: "Duplicate Group Name",
        getMessage: () => `A group with this name already exists.`,
        suggestion: () => `Please choose a different name for your group.`,
        icon: <FileTextOutlined className="text-amber-500 text-xl" />,
      },
      {
        regex: /role required/i,
        title: "Missing Role Assignment",
        getMessage: () => `Each group member must have an assigned role.`,
        suggestion: () =>
          `Please ensure all members have a role assigned (Leader or Member).`,
        icon: <CrownOutlined className="text-amber-500 text-xl" />,
      },
    ];

    // Try to match the error message with patterns
    for (const pattern of errorPatterns) {
      const matches = message.match(pattern.regex);
      if (matches) {
        return {
          title: pattern.title,
          detail: pattern.getMessage(matches),
          suggestion: pattern.suggestion(matches),
          icon: pattern.icon,
        };
      }
    }

    // Default parsing for unrecognized errors
    return {
      title: "Error Creating Group",
      detail: message,
      suggestion: "Please review your group information and try again.",
      icon: <ExclamationCircleOutlined className="text-amber-500 text-xl" />,
    };
  };

  // Extract error message from different error object structures
  const errorMessage = error?.data?.message || error?.message || String(error);
  const { title, detail, suggestion, icon } = parseErrorMessage(errorMessage);

  return (
    <Alert
      type="error"
      className="mb-6 rounded-lg border-red-300 shadow-sm"
      showIcon={false}
      closable
      onClose={onClose}
      icon={<CloseCircleOutlined className="text-red-500 text-xl" />}
      message={
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-full">
            <CloseCircleOutlined className="text-red-500 text-xl" />
          </div>
          <Text strong className="text-base">
            {title}
          </Text>
        </div>
      }
      description={
        <Space direction="vertical" className="w-full mt-2">
          <Paragraph className="ml-10 text-gray-700">{detail}</Paragraph>

          {suggestion && (
            <div className="ml-10 mt-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <SolutionOutlined className="text-amber-500 mt-1" />
                <div>
                  <Text strong className="text-amber-700">
                    Suggested Action
                  </Text>
                  <Paragraph className="text-amber-700 mb-0">
                    {suggestion}
                  </Paragraph>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <Button
              type="text"
              size="small"
              icon={<QuestionCircleOutlined />}
              className="text-gray-500 hover:text-orange-500"
            >
              Need Help?
            </Button>
          </div>
        </Space>
      }
    />
  );
};

export default ErrorFeedback;
