import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Space,
  Tag,
  List,
  Avatar,
  Spin,
} from "antd";
import { UserOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons";
import { useGetDepartmentsQuery } from "../../features/department/departmentApiSlice";
import { useGetLecturersQuery } from "../../features/user/userApiSlice";

const { Option } = Select;

const CreateCouncil = () => {
  const [form] = Form.useForm();
  const [selectedMembers, setSelectedMembers] = useState({
    chairman: null,
    secretary: null,
    members: [],
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();

  // Fetch lecturers
  const {
    data: lecturersData,
    isLoading: isLoadingLecturers,
    isError: isLecturersError,
  } = useGetLecturersQuery();

  // Debug - log the lecturers data
  useEffect(() => {
    if (lecturersData?.lecturers) {
      console.log("All lecturers:", lecturersData.lecturers);
    }
  }, [lecturersData]);

  // Debug - log lecturers for the selected department
  useEffect(() => {
    if (lecturersData?.lecturers && selectedDepartment) {
      // Make sure we're comparing the same type (convert to number to be safe)
      const deptId = Number(selectedDepartment);
      const deptLecturers = lecturersData.lecturers.filter(
        (l) => Number(l.departmentId) === deptId
      );
      console.log(
        `Department ${deptId} has ${deptLecturers.length} lecturers:`,
        deptLecturers
      );
    }
  }, [lecturersData, selectedDepartment]);

  // Filter lecturers by department and exclude already selected ones
  const filterLecturers = (role) => {
    if (!lecturersData?.lecturers || !selectedDepartment) return [];

    // Get the ids of already selected lecturers to exclude them
    const selectedIds = [
      selectedMembers.chairman?.userId,
      selectedMembers.secretary?.userId,
      ...(selectedMembers.members.map((m) => m.userId) || []),
    ].filter(Boolean);

    // Make sure we're comparing the same type (convert to number to be safe)
    const deptId = Number(selectedDepartment);

    // Filter lecturers by department and exclude already selected ones
    return lecturersData.lecturers.filter(
      (lecturer) =>
        Number(lecturer.departmentId) === deptId &&
        !selectedIds.includes(lecturer.userId)
    );
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Form values:", values);

      // Log the complete council data for debugging
      console.log("Council data:", {
        councilName: values.councilName,
        departmentId: selectedDepartment,
        chairman: selectedMembers.chairman,
        secretary: selectedMembers.secretary,
        members: selectedMembers.members,
      });

      message.success("Council created successfully");
      form.resetFields();
      setSelectedMembers({
        chairman: null,
        secretary: null,
        members: [],
      });
      setSelectedDepartment(null);
    } catch (error) {
      message.error("Failed to create council");
    }
  };

  // Handle department selection - reset the form when department changes
  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(Number(departmentId));

    // Reset selected members when department changes
    setSelectedMembers({
      chairman: null,
      secretary: null,
      members: [],
    });

    // Reset form fields related to lecturers
    form.setFieldsValue({
      chairman: undefined,
      secretary: undefined,
      members: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Review Council
          </h2>
          <p className="text-gray-600">
            Form a council to review research proposals
          </p>
        </div>

        <Card className="shadow-lg rounded-xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            {/* Council Basic Information */}
            <div className="space-y-4">
              <Form.Item
                label="Council Name"
                name="councilName"
                rules={[
                  { required: true, message: "Please enter council name" },
                ]}
              >
                <Input placeholder="Enter council name" />
              </Form.Item>

              <Form.Item
                label={
                  <div className="flex items-center">
                    <BankOutlined className="mr-2" />
                    <span>Department</span>
                  </div>
                }
                name="departmentId"
                rules={[
                  { required: true, message: "Please select department" },
                ]}
              >
                {isLoadingDepartments ? (
                  <div className="flex items-center justify-center py-2">
                    <Spin size="small" />
                    <span className="ml-2 text-gray-500">
                      Loading departments...
                    </span>
                  </div>
                ) : isDepartmentsError ? (
                  <div className="text-red-500 py-2">
                    Error loading departments. Please try again.
                  </div>
                ) : (
                  <Select
                    placeholder="Select department"
                    onChange={handleDepartmentChange}
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {departments?.map((department) => (
                      <Option
                        key={department.departmentId}
                        value={department.departmentId}
                      >
                        {department.departmentName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </div>

            {/* Council Members Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Council Members
              </h3>

              {isLoadingLecturers && (
                <div className="py-4 text-center">
                  <Spin />
                  <p className="mt-2 text-gray-500">Loading lecturers...</p>
                </div>
              )}

              {isLecturersError && (
                <div className="py-4 text-center text-red-500">
                  Error loading lecturers. Please try again.
                </div>
              )}

              {!selectedDepartment && !isLoadingLecturers && (
                <div className="py-4 bg-gray-50 text-center rounded-lg border border-dashed border-gray-300">
                  <BankOutlined className="text-3xl text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    Please select a department first
                  </p>
                </div>
              )}

              {selectedDepartment && !isLoadingLecturers && (
                <>
                  {/* Chairman Selection */}
                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <UserOutlined className="mr-2 text-blue-500" />
                        <span>Chairman</span>
                      </div>
                    }
                    name="chairman"
                    rules={[
                      { required: true, message: "Please select chairman" },
                    ]}
                  >
                    <Select
                      placeholder="Select chairman"
                      onChange={(value) => {
                        const chairman = lecturersData.lecturers.find(
                          (l) => l.userId === value
                        );
                        setSelectedMembers((prev) => ({ ...prev, chairman }));
                      }}
                      loading={isLoadingLecturers}
                      disabled={!selectedDepartment || isLoadingLecturers}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {filterLecturers().map((lecturer) => (
                        <Option key={lecturer.userId} value={lecturer.userId}>
                          <div className="flex items-center">
                            <Avatar
                              size="small"
                              icon={<UserOutlined />}
                              className="bg-blue-500 mr-2"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lecturer.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lecturer.levelText} • {lecturer.email}
                              </span>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Secretary Selection */}
                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <UserOutlined className="mr-2 text-green-500" />
                        <span>Secretary</span>
                      </div>
                    }
                    name="secretary"
                    rules={[
                      { required: true, message: "Please select secretary" },
                    ]}
                  >
                    <Select
                      placeholder="Select secretary"
                      onChange={(value) => {
                        const secretary = lecturersData.lecturers.find(
                          (l) => l.userId === value
                        );
                        setSelectedMembers((prev) => ({ ...prev, secretary }));
                      }}
                      loading={isLoadingLecturers}
                      disabled={!selectedDepartment || isLoadingLecturers}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {filterLecturers().map((lecturer) => (
                        <Option key={lecturer.userId} value={lecturer.userId}>
                          <div className="flex items-center">
                            <Avatar
                              size="small"
                              icon={<UserOutlined />}
                              className="bg-green-500 mr-2"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lecturer.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lecturer.levelText} • {lecturer.email}
                              </span>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Members Selection */}
                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <TeamOutlined className="mr-2 text-orange-500" />
                        <span>Members</span>
                      </div>
                    }
                    name="members"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one member",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select members"
                      onChange={(values) => {
                        const members = lecturersData.lecturers.filter((l) =>
                          values.includes(l.userId)
                        );
                        setSelectedMembers((prev) => ({ ...prev, members }));
                      }}
                      loading={isLoadingLecturers}
                      disabled={!selectedDepartment || isLoadingLecturers}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      maxTagCount={3}
                    >
                      {filterLecturers().map((lecturer) => (
                        <Option key={lecturer.userId} value={lecturer.userId}>
                          <div className="flex items-center">
                            <Avatar
                              size="small"
                              icon={<UserOutlined />}
                              className="mr-2"
                              style={{
                                backgroundColor:
                                  lecturer.level === 0
                                    ? "#1890ff"
                                    : lecturer.level === 1
                                    ? "#52c41a"
                                    : lecturer.level === 2
                                    ? "#faad14"
                                    : "#f5222d",
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lecturer.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lecturer.levelText} • {lecturer.email}
                              </span>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )}
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#FF8C00]/90 hover:to-[#FFA500]/90"
                disabled={
                  !selectedDepartment ||
                  isLoadingLecturers ||
                  isLoadingDepartments
                }
              >
                Create Council
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCouncil;
