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
} from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../features/department/departmentApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const AssignTimeline = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Use the real API for departments
  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useGetDepartmentsQuery();

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
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
              onClick={() =>
                console.log(
                  `Assign timeline to department: ${record.departmentName}`
                )
              }
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
    </div>
  );
};

export default AssignTimeline;
