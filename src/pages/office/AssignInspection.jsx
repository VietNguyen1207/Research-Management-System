import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Steps,
  Button,
  Spin,
  Alert,
  Row,
  Col,
  message,
  Table,
  Tag,
  Input,
  Space,
  Modal,
  Empty,
} from "antd";
import {
  SafetyCertificateOutlined,
  TeamOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ProjectOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";
import { GROUP_TYPE } from "../../constants/enums";
import { GROUP_MEMBER_ROLE } from "../../constants/enums";

const { Title, Text } = Typography;
const { Step } = Steps;

const COUNCIL_GROUP_STATUS_COLORS = {
  Pending: "gold",
  Active: "green",
  Inactive: "default",
  Assigned: "blue",
  1: "green",
  3: "blue",
};

const AssignInspection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [councilSearchText, setCouncilSearchText] = useState("");

  const [selectedInspections, setSelectedInspections] = useState([]);
  const [selectedInspectionCouncil, setSelectedInspectionCouncil] =
    useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [location, setLocation] = useState("");

  const {
    data: councilsData,
    isLoading: councilsLoading,
    isError: councilsApiError,
    error: councilsErrorData,
  } = useGetCouncilGroupsQuery();

  const [filteredCouncilGroups, setFilteredCouncilGroups] = useState([]);

  // New state for members modal
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [membersToShowInModal, setMembersToShowInModal] = useState([]);
  const [currentCouncilForModal, setCurrentCouncilForModal] = useState(null);

  useEffect(() => {
    if (councilsData?.data) {
      const inspectionCouncils = councilsData.data.filter(
        (council) => council.groupType === GROUP_TYPE.INSPECTION_COUNCIL
      );
      setFilteredCouncilGroups(
        inspectionCouncils.filter(
          (council) =>
            (council.groupName ?? "")
              .toLowerCase()
              .includes(councilSearchText.toLowerCase()) ||
            (council.departmentName ?? "")
              .toLowerCase()
              .includes(councilSearchText.toLowerCase())
        )
      );
    } else {
      setFilteredCouncilGroups([]);
    }
  }, [councilsData, councilSearchText]);

  const handleCouncilSelection = (record) => {
    setSelectedInspectionCouncil(record);
  };

  const councilColumns = [
    {
      title: "Council Name",
      dataIndex: "groupName",
      key: "groupName",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <TeamOutlined className="mr-1" />
            {record.currentMember || record.members?.length || 0} /{" "}
            {record.maxMember} members
          </Text>
        </Space>
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusText =
          councilsData?.data.find((c) => c.status === status)
            ?.groupStatusName || `Status ${status}`;
        const color =
          COUNCIL_GROUP_STATUS_COLORS[statusText] ||
          COUNCIL_GROUP_STATUS_COLORS[status] ||
          "default";
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Expertise",
      key: "expertises",
      dataIndex: "expertises",
      render: (expertises) => {
        if (!expertises || expertises.length === 0) {
          return <Text type="secondary">N/A</Text>;
        }
        return (
          <div
            style={{
              maxWidth: 200,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {expertises.map((expertise, index) => (
              <Tag key={index} color="purple">
                {expertise}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Members",
      key: "members",
      render: (_, record) => (
        <Button
          size="small"
          icon={<TeamOutlined />}
          onClick={() => {
            setMembersToShowInModal(record.members || []);
            setCurrentCouncilForModal(record);
            setIsMembersModalVisible(true);
          }}
        >
          View Members
        </Button>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep === 0 && !selectedInspectionCouncil) {
      message.error("Please select an inspection council.");
      return;
    }
    if (currentStep === 1 && selectedInspections.length === 0) {
      message.error("Please select at least one item/area to inspect.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    message.success(
      "Inspection assignment submitted successfully (Placeholder)!"
    );
    // Placeholder for actual submission logic
    // navigate to a relevant page after submission
  };

  if (councilsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Spin size="large" />
          <Text className="block mt-2">
            Loading inspection assignment data...
          </Text>
        </div>
      </div>
    );
  }

  if (councilsApiError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Error Loading Councils"
            description={
              councilsErrorData?.data?.message ||
              "Failed to load council data. Please try again."
            }
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 mb-2">
              Assign Inspection
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Assign items or areas to inspection councils and schedule
            inspections.
          </p>
        </div>

        <Card className="mb-8 shadow-sm">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            <Button
              type="primary"
              ghost
              onClick={() => navigate("/assign-review")}
              icon={<ProjectOutlined />}
              className="border-orange-500 text-orange-500 hover:border-orange-700 hover:text-orange-700"
            >
              Go to Assign Review
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => navigate("/assign-assessment")}
              icon={<SolutionOutlined />}
              className="border-purple-500 text-purple-500 hover:border-purple-700 hover:text-purple-700"
            >
              Go to Assign Assessment
            </Button>
          </div>
        </Card>

        {currentCouncilForModal && (
          <Modal
            title={`Members of "${currentCouncilForModal.groupName}"`}
            open={isMembersModalVisible}
            onCancel={() => setIsMembersModalVisible(false)}
            footer={[
              <Button
                key="close"
                onClick={() => setIsMembersModalVisible(false)}
              >
                Close
              </Button>,
            ]}
            width={600}
          >
            {membersToShowInModal.length > 0 ? (
              <Table
                dataSource={membersToShowInModal}
                rowKey={(member) => member.groupMemberId || member.userId}
                columns={[
                  {
                    title: "Name",
                    dataIndex: "memberName",
                    key: "memberName",
                  },
                  {
                    title: "Email",
                    dataIndex: "memberEmail",
                    key: "memberEmail",
                    render: (email) =>
                      email || <Text type="secondary">N/A</Text>,
                  },
                  {
                    title: "Role",
                    dataIndex: "role",
                    key: "role",
                    render: (role) => {
                      const roleText = GROUP_MEMBER_ROLE[role] || "N/A";
                      return roleText ? (
                        <Tag color="blue">{roleText}</Tag>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      );
                    },
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => {
                      let statusText = `Status ${status}`;
                      let color = "default";
                      if (status === 1) {
                        statusText = "Active";
                        color = "success";
                      }
                      if (status === 0) {
                        statusText = "Pending";
                        color = "processing";
                      }
                      return statusText ? (
                        <Tag color={color}>{statusText}</Tag>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      );
                    },
                  },
                ]}
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="No members found for this council." />
            )}
          </Modal>
        )}

        <Card className="mb-8 shadow-sm">
          <Steps current={currentStep} className="px-8">
            <Step title="Select Inspection Council" icon={<TeamOutlined />} />
            <Step
              title="Select Items/Areas for Inspection"
              icon={<SafetyCertificateOutlined />}
            />
            <Step title="Schedule Inspection" icon={<CarryOutOutlined />} />
            <Step title="Confirm" icon={<CheckCircleOutlined />} />
          </Steps>
        </Card>

        {currentStep === 0 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <TeamOutlined className="mr-2 text-blue-500" />
              Select Inspection Council
            </Title>
            <Input
              placeholder="Search by council name or department"
              prefix={<SearchOutlined />}
              value={councilSearchText}
              onChange={(e) => setCouncilSearchText(e.target.value)}
              className="mb-4"
              style={{ maxWidth: "500px" }}
            />
            <Table
              rowKey="groupId"
              dataSource={filteredCouncilGroups}
              columns={councilColumns}
              rowSelection={{
                type: "radio",
                selectedRowKeys: selectedInspectionCouncil
                  ? [selectedInspectionCouncil.groupId]
                  : [],
                onSelect: handleCouncilSelection,
              }}
              pagination={{ pageSize: 5 }}
              locale={{
                emptyText: "No Inspection Councils found or available.",
              }}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-teal-500 border-none"
              >
                Next: Select Items/Areas
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <SafetyCertificateOutlined className="mr-2 text-blue-500" />
              Select Items/Areas for Inspection
            </Title>
            <div className="text-center py-8">
              <Text type="secondary">
                Item/Area selection UI will be implemented here.
              </Text>
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Council</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-teal-500 border-none"
              >
                Next: Schedule Inspection
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <CarryOutOutlined className="mr-2 text-blue-500" />
              Schedule Inspection
            </Title>
            <div className="text-center py-8">
              <Text type="secondary">
                Scheduling form UI will be implemented here.
              </Text>
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Items/Areas</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-teal-500 border-none"
              >
                Next: Confirm Details
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <CheckCircleOutlined className="mr-2 text-blue-500" />
              Review Inspection Assignment
            </Title>
            <div className="text-center py-8">
              <Text type="secondary">
                Confirmation details UI will be implemented here.
              </Text>
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Schedule</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 border-none"
              >
                Assign Inspection
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <InfoCircleOutlined className="mr-1" />
          Ensure all inspection details are accurate before submission.
        </div>
      </div>
    </div>
  );
};

export default AssignInspection;
