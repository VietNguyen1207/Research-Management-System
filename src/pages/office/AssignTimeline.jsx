import React, { useState } from "react";
import {
  Typography,
  Table,
  Card,
  Select,
  Button,
  Form,
  Space,
  Tag,
  Breadcrumb,
  Spin,
  Empty,
  Tooltip,
  Modal,
  Divider,
  DatePicker,
  Input,
  message,
} from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../features/department/departmentApiSlice";
import { useGetAllTimelinesQuery } from "../../features/timeline/timelineApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AssignTimeline = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  // Use the real API for departments
  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useGetDepartmentsQuery();

  // Fetch all available timelines
  const {
    data: timelines,
    isLoading: timelinesLoading,
    error: timelinesError,
  } = useGetAllTimelinesQuery();

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const showAssignModal = (department) => {
    setCurrentDepartment(department);
    setIsAssignModalVisible(true);
    assignForm.resetFields();
  };

  const handleAssignSubmit = (values) => {
    console.log("Submitting assignment:", {
      departmentId: currentDepartment.departmentId,
      ...values,
    });

    // Here you would call the API to assign the timeline
    // For now, just show a success message
    message.success(
      `Timeline "${values.timeline}" assigned to ${currentDepartment.departmentName}`
    );
    setIsAssignModalVisible(false);
  };

  // Define table columns for departments
  const columns = [
    {
      title: "Department ID",
      dataIndex: "departmentId",
      key: "departmentId",
      width: 120,
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="green">Active</Tag>,
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Assign Timeline">
            <Button
              type="primary"
              icon={<ScheduleOutlined />}
              onClick={() => showAssignModal(record)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Assign Timeline
            </Button>
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() =>
                console.log(`View details for ${record.departmentName}`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filter departments based on selection
  const filteredDepartments = selectedDepartment
    ? departments?.filter((dept) => dept.departmentId === selectedDepartment)
    : departments;

  // Group timelines by sequence for the dropdown
  const timelineOptions = timelines
    ? timelines.reduce((acc, timeline) => {
        // Create sequence group if it doesn't exist
        if (!acc[timeline.sequenceName]) {
          acc[timeline.sequenceName] = {
            label: timeline.sequenceName,
            options: [],
          };
        }

        // Add timeline to its sequence group
        acc[timeline.sequenceName].options.push({
          label: timeline.event,
          value: timeline.id,
        });

        return acc;
      }, {})
    : {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Home
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <ProjectOutlined /> Project Management
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <ScheduleOutlined /> Assign Timeline
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <Title level={3} className="m-0">
              <CalendarOutlined className="mr-2 text-blue-500" /> Assign
              Department Timelines
            </Title>
          </div>

          <Text className="block mb-6">
            Assign timelines to departments for research project management.
            Select a department to filter the list.
          </Text>

          <Form form={form} layout="inline" className="mb-6">
            <Form.Item label="Filter by Department" className="mb-4">
              <Select
                placeholder="Select department"
                style={{ width: 240 }}
                onChange={handleDepartmentChange}
                allowClear
                loading={departmentsLoading}
              >
                {departments?.map((dept) => (
                  <Option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Card>

        <Card className="shadow-sm">
          {departmentsLoading ? (
            <div className="flex justify-center items-center p-10">
              <Spin size="large" tip="Loading departments..." />
            </div>
          ) : filteredDepartments?.length > 0 ? (
            <Table
              dataSource={filteredDepartments}
              columns={columns}
              rowKey="departmentId"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty
              description="No departments found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      </div>

      {/* Timeline Assignment Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="text-blue-500 mr-2" />
            <span>Assign Timeline to Department</span>
          </div>
        }
        open={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentDepartment && (
          <Form
            form={assignForm}
            layout="vertical"
            onFinish={handleAssignSubmit}
          >
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text strong>Department:</Text> {currentDepartment.departmentName}
              <Tag
                color="blue"
                className="ml-2"
              >{`ID: ${currentDepartment.departmentId}`}</Tag>
            </div>

            <Form.Item
              name="timeline"
              label="Select Timeline"
              rules={[{ required: true, message: "Please select a timeline" }]}
            >
              <Select
                placeholder="Select a timeline"
                showSearch
                loading={timelinesLoading}
                optionFilterProp="children"
                style={{ width: "100%" }}
                options={Object.values(timelineOptions)}
              />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Override Date Range (Optional)"
              tooltip="Specify custom date range for this department. Leave empty to use the default timeline dates."
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="notes" label="Notes (Optional)">
              <Input.TextArea
                rows={3}
                placeholder="Add any department-specific notes about this timeline"
              />
            </Form.Item>

            <Divider />

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
              <Text className="text-blue-500">
                <InfoCircleOutlined className="mr-2" />
                Assigning this timeline will make it visible to all users in
                this department.
              </Text>
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsAssignModalVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Assign Timeline
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AssignTimeline;
