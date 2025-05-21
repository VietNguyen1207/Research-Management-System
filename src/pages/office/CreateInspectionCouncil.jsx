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
import { useCreateInspectionCouncilMutation } from "../../features/group/groupApiSlice";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateInspectionCouncil = () => {
  const [form] = Form.useForm();
  const [selectedMembers, setSelectedMembers] = useState({
    chairman: null,
    secretary: null,
    members: [],
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

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

  // Council creation mutation - will be replaced with the actual API
  const [createInspectionCouncil, { isLoading: isCreating }] =
    useCreateInspectionCouncilMutation();

  // Navigate
  const navigate = useNavigate();

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
      // Map the members according to their roles
      const formattedMembers = [];

      // Add chairman with Council_Chairman role (3)
      if (selectedMembers.chairman) {
        formattedMembers.push({
          memberName: selectedMembers.chairman.fullName,
          memberEmail: selectedMembers.chairman.email,
          role: 3, // Council_Chairman
        });
      }

      // Add secretary with Secretary role (4)
      if (selectedMembers.secretary) {
        formattedMembers.push({
          memberName: selectedMembers.secretary.fullName,
          memberEmail: selectedMembers.secretary.email,
          role: 4, // Secretary
        });
      }

      // Add regular members with Council_Member role (5)
      if (selectedMembers.members.length > 0) {
        selectedMembers.members.forEach((member) => {
          formattedMembers.push({
            memberName: member.fullName,
            memberEmail: member.email,
            role: 5, // Council_Member
          });
        });
      }

      // Get the council name from the form
      const councilName = form.getFieldValue("councilName");

      // Prepare the request payload - simplified to match API contract
      const requestPayload = {
        groupName: councilName,
        groupDepartment: Number(selectedDepartment),
        members: formattedMembers,
      };

      console.log("Inspection Council request payload:", requestPayload);

      // Call the specific API for inspection councils
      const response = await createInspectionCouncil(requestPayload).unwrap();

      message.success("Inspection Council created successfully");
      form.resetFields();
      setSelectedMembers({
        chairman: null,
        secretary: null,
        members: [],
      });
      setSelectedDepartment(null);
      setCurrentStep(0);
      setPreviewVisible(false);

      // Navigate to ManageCouncil page after successful creation
      navigate("/manage-council");
    } catch (error) {
      console.error("Failed to create council:", error);
      message.error(
        "Failed to create council: " + (error.data?.message || "Unknown error")
      );
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

  const handleStepChange = (direction) => {
    if (direction === "next") {
      // Validate current step before proceeding
      if (currentStep === 0) {
        // Validate basic info
        form
          .validateFields(["councilName", "departmentId"])
          .then(() => {
            setCurrentStep(1);
          })
          .catch((error) => {
            // Form validation failed
            console.error("Validation failed:", error);
          });
      } else if (currentStep === 1) {
        // Validate members before showing preview
        if (
          !selectedMembers.chairman ||
          !selectedMembers.secretary ||
          selectedMembers.members.length === 0
        ) {
          message.error(
            "Please select a chairman, secretary, and at least one member"
          );
          return;
        }
        // Show preview and set current step to 2
        setPreviewVisible(true);
        setCurrentStep(2);
      }
    } else {
      // Go back
      if (previewVisible) {
        // If in preview mode, return to members selection
        setPreviewVisible(false);
        setCurrentStep(1);
      } else if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className={`step-item ${currentStep >= 0 ? "active" : ""}`}>
          <div className="step-circle bg-gradient-to-r from-[#FF8C00] to-[#FFA500] flex items-center justify-center text-white font-bold">
            1
          </div>
          <div className="step-title mt-2 text-sm font-medium">
            Basic Information
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] transition-all duration-300`}
            style={{ width: currentStep >= 1 ? "100%" : "0%" }}
          ></div>
        </div>
        <div className={`step-item ${currentStep >= 1 ? "active" : ""}`}>
          <div
            className={`step-circle ${
              currentStep >= 1
                ? "bg-gradient-to-r from-[#FF8C00] to-[#FFA500]"
                : "bg-gray-300"
            } flex items-center justify-center text-white font-bold`}
          >
            2
          </div>
          <div className="step-title mt-2 text-sm font-medium">
            Council Members
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] transition-all duration-300`}
            style={{ width: previewVisible ? "100%" : "0%" }}
          ></div>
        </div>
        <div className={`step-item ${previewVisible ? "active" : ""}`}>
          <div
            className={`step-circle ${
              previewVisible
                ? "bg-gradient-to-r from-[#FF8C00] to-[#FFA500]"
                : "bg-gray-300"
            } flex items-center justify-center text-white font-bold`}
          >
            3
          </div>
          <div className="step-title mt-2 text-sm font-medium">
            Preview & Submit
          </div>
        </div>
      </div>
    </div>
  );

  const CouncilPreview = () => (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Council Preview</h3>

      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-1">Council Name</h4>
        <div className="font-medium">{form.getFieldValue("councilName")}</div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-1">Department</h4>
        <div className="font-medium">
          {departments?.find(
            (d) => d.departmentId === Number(selectedDepartment)
          )?.departmentName || "-"}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-1">Chairman</h4>
        <div className="flex items-center">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className="bg-blue-500 mr-2"
          />
          <div>
            <div className="font-medium">
              {selectedMembers.chairman?.fullName}
            </div>
            <div className="text-xs text-gray-500">
              {selectedMembers.chairman?.email}
            </div>
            {selectedMembers.chairman?.expertises &&
              selectedMembers.chairman.expertises.length > 0 && (
                <div className="mt-1">
                  {selectedMembers.chairman.expertises.map(
                    (expertise, index) => (
                      <Tag
                        key={index}
                        color="blue"
                        className="mr-1 mb-1 text-xs"
                      >
                        {expertise.expertiseName}
                      </Tag>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-1">Secretary</h4>
        <div className="flex items-center">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className="bg-green-500 mr-2"
          />
          <div>
            <div className="font-medium">
              {selectedMembers.secretary?.fullName}
            </div>
            <div className="text-xs text-gray-500">
              {selectedMembers.secretary?.email}
            </div>
            {selectedMembers.secretary?.expertises &&
              selectedMembers.secretary.expertises.length > 0 && (
                <div className="mt-1">
                  {selectedMembers.secretary.expertises.map(
                    (expertise, index) => (
                      <Tag
                        key={index}
                        color="green"
                        className="mr-1 mb-1 text-xs"
                      >
                        {expertise.expertiseName}
                      </Tag>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-gray-500 mb-2">
          Members ({selectedMembers.members.length})
        </h4>
        <div className="space-y-2">
          {selectedMembers.members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center bg-white p-2 rounded-md"
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-orange-500 mr-2"
              />
              <div>
                <div className="font-medium">{member.fullName}</div>
                <div className="text-xs text-gray-500">{member.email}</div>
                {member.expertises && member.expertises.length > 0 && (
                  <div className="mt-1">
                    {member.expertises.map((expertise, index) => (
                      <Tag
                        key={index}
                        color="orange"
                        className="mr-1 mb-1 text-xs"
                      >
                        {expertise.expertiseName}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // First, wrap the form contents in a function that prevents automatic submission
  const handleFormSubmit = (e) => {
    // Only submit the form when explicitly called in the final step
    if (currentStep !== 2) {
      e.preventDefault();
      return;
    }
    // Otherwise, continue with normal form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Inspection Council
          </h2>
          <p className="text-gray-600">
            Form a council to inspect and verify research activities
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        <Card className="shadow-lg rounded-xl overflow-hidden">
          <Form
            form={form}
            layout="vertical"
            className="space-y-6"
            onSubmit={handleFormSubmit}
          >
            {/* Basic Information - Step 1 */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <Form.Item
                  label="Council Name"
                  name="councilName"
                  rules={[
                    { required: true, message: "Please enter council name" },
                  ]}
                >
                  <Input placeholder="Enter a descriptive name for your inspection council" />
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
            )}

            {/* Council Members - Step 2 */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
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
                      className="mb-6"
                    >
                      <Select
                        placeholder="Select chairman"
                        onChange={(value) => {
                          const chairman = lecturersData.lecturers.find(
                            (l) => l.email === value
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
                          <Option key={lecturer.userId} value={lecturer.email}>
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
                                {lecturer.expertises &&
                                  lecturer.expertises.length > 0 && (
                                    <div className="mt-1">
                                      {lecturer.expertises.map(
                                        (expertise, index) => (
                                          <Tag
                                            key={index}
                                            color="blue"
                                            className="mr-1 mb-1 text-xs"
                                          >
                                            {expertise.expertiseName}
                                          </Tag>
                                        )
                                      )}
                                    </div>
                                  )}
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
                      className="mb-6"
                    >
                      <Select
                        placeholder="Select secretary"
                        onChange={(value) => {
                          const secretary = lecturersData.lecturers.find(
                            (l) => l.email === value
                          );
                          setSelectedMembers((prev) => ({
                            ...prev,
                            secretary,
                          }));
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
                          <Option key={lecturer.userId} value={lecturer.email}>
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
                                {lecturer.expertises &&
                                  lecturer.expertises.length > 0 && (
                                    <div className="mt-1">
                                      {lecturer.expertises.map(
                                        (expertise, index) => (
                                          <Tag
                                            key={index}
                                            color="green"
                                            className="mr-1 mb-1 text-xs"
                                          >
                                            {expertise.expertiseName}
                                          </Tag>
                                        )
                                      )}
                                    </div>
                                  )}
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
                            values.includes(l.email)
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
                          <Option key={lecturer.userId} value={lecturer.email}>
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
                                {lecturer.expertises &&
                                  lecturer.expertises.length > 0 && (
                                    <div className="mt-1">
                                      {lecturer.expertises.map(
                                        (expertise, index) => (
                                          <Tag
                                            key={index}
                                            color="orange"
                                            className="mr-1 mb-1 text-xs"
                                          >
                                            {expertise.expertiseName}
                                          </Tag>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                )}
              </div>
            )}

            {/* Preview - Step 3 */}
            {currentStep === 2 && previewVisible && (
              <div className="animate-fadeIn">
                <CouncilPreview />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <Button
                onClick={() => handleStepChange("back")}
                disabled={currentStep === 0}
              >
                Back
              </Button>

              <div>
                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    onClick={() => handleStepChange("next")}
                    className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                  >
                    {currentStep === 0
                      ? "Next: Select Members"
                      : "Next: Preview"}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={isCreating}
                    className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
                    disabled={isCreating}
                    icon={<TeamOutlined />}
                  >
                    Create Inspection Council
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateInspectionCouncil;
