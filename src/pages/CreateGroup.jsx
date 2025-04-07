import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Divider,
  Tag,
  Space,
  Tooltip,
  Alert,
  Spin,
  Avatar,
  Badge,
  AutoComplete,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MailOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SendOutlined,
  SearchOutlined,
  BankOutlined,
  CrownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useGetLecturersQuery,
  useGetStudentsQuery,
  useGetAcademicUsersQuery,
} from "../features/user/userApiSlice";
import { useCreateResearchGroupMutation } from "../features/group/groupApiSlice";
import ErrorFeedback from "../components/ErrorFeedback";

const { Option } = Select;

const CreateGroup = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Check if user is a lecturer
  const isLecturer = user?.role === "lecturer";

  // Set member limit based on role
  const maxMembers = isLecturer ? 10 : 5;

  // Fetch lecturers and students from API
  const {
    data: lecturersData,
    isLoading: isLoadingLecturers,
    isError: isLecturersError,
    error: lecturersError,
  } = useGetLecturersQuery(undefined, { skip: isLecturer });

  const {
    data: students,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
  } = useGetStudentsQuery(undefined, { skip: isLecturer });

  // New query for lecturer to see both students and lecturers
  const {
    data: academicUsers,
    isLoading: isLoadingAcademicUsers,
    isError: isAcademicUsersError,
  } = useGetAcademicUsersQuery(undefined, { skip: !isLecturer });

  // Add the create mutation
  const [createResearchGroup, { isLoading: isCreating }] =
    useCreateResearchGroupMutation();

  // Update autocomplete options based on user role
  useEffect(() => {
    if (!emailInput) {
      setAutoCompleteOptions([]);
      return;
    }

    const inputLower = emailInput.toLowerCase();

    if (isLecturer && academicUsers) {
      // For lecturers, show both students and other lecturers
      const filteredUsers = academicUsers.allUsers
        .filter(
          (u) =>
            u.email.toLowerCase().includes(inputLower) ||
            u.fullName.toLowerCase().includes(inputLower)
        )
        .filter(
          (u) =>
            // Exclude already added members
            !members.some((member) => member.email === u.email) &&
            // Exclude the current user
            u.userId !== user.userId &&
            u.email.toLowerCase() !== user.email.toLowerCase()
        );

      const options = filteredUsers.map((user) => ({
        value: user.email,
        label: (
          <div className="flex items-center space-x-2">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className={
                user.userType === "Lecturer" ? "bg-[#1890ff]" : "bg-[#D2691E]"
              }
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium">{user.fullName}</span>
                <Tag
                  color={user.userType === "Lecturer" ? "blue" : "orange"}
                  className="ml-2 text-xs px-1 py-0"
                >
                  {user.userType}
                </Tag>
              </div>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        ),
        user: user,
      }));

      setAutoCompleteOptions(options);
    } else if (students) {
      // For students, only show other students
      const filteredStudents = students
        .filter(
          (student) =>
            student.email.toLowerCase().includes(inputLower) ||
            student.fullName.toLowerCase().includes(inputLower)
        )
        .filter(
          (student) =>
            // Exclude already added members
            !members.some((member) => member.email === student.email) &&
            // Exclude the current user
            student.userId !== user.userId &&
            student.email.toLowerCase() !== user.email.toLowerCase()
        );

      const options = filteredStudents.map((student) => ({
        value: student.email,
        label: (
          <div className="flex items-center space-x-2">
            <Avatar size="small" icon={<UserOutlined />} />
            <div className="flex flex-col">
              <span className="font-medium">{student.fullName}</span>
              <span className="text-xs text-gray-500">{student.email}</span>
            </div>
          </div>
        ),
        student: student,
      }));

      setAutoCompleteOptions(options);
    }
  }, [emailInput, students, academicUsers, members, isLecturer, user]);

  const handleAddMember = () => {
    if (emailInput && members.length < maxMembers) {
      // Validate self select
      if (emailInput.toLowerCase() === user.email.toLowerCase()) {
        message.error("You cannot add yourself as a member!");
        return;
      }

      if (!members.some((member) => member.email === emailInput)) {
        if (isLecturer && academicUsers) {
          // Lecturers select both student and lecturer
          const foundUser = academicUsers.allUsers.find(
            (u) => u.email.toLowerCase() === emailInput.toLowerCase()
          );

          if (foundUser) {
            // Prevent self select as a member (lol)
            if (foundUser.userId === user.userId) {
              message.error("You cannot add yourself as a member!");
              return;
            }

            setMembers([
              ...members,
              {
                userId: foundUser.userId,
                email: foundUser.email,
                fullName: foundUser.fullName,
                role: "Member",
                userType: foundUser.userType,
              },
            ]);
          } else {
            // Add with just the email if not found
            setMembers([...members, { email: emailInput, role: "Member" }]);
          }
        } else if (students) {
          // For students, check only in students list
          const student = students.find(
            (s) => s.email.toLowerCase() === emailInput.toLowerCase()
          );

          if (student) {
            // Double check it's not the current user
            if (student.userId === user.userId) {
              message.error("You cannot add yourself as a member!");
              return;
            }

            setMembers([
              ...members,
              {
                userId: student.userId,
                email: student.email,
                fullName: student.fullName,
                role: "Member",
              },
            ]);
          } else {
            // Add with just the email if not found
            setMembers([...members, { email: emailInput, role: "Member" }]);
          }
        }

        setEmailInput("");
      } else {
        message.error("This member is already added!");
      }
    } else if (members.length >= maxMembers) {
      message.warning(`Maximum ${maxMembers} members allowed in a group!`);
    }
  };

  const handleSelectStudent = (email, option) => {
    if (members.length < maxMembers) {
      if (!members.some((member) => member.email === email)) {
        if (isLecturer) {
          const user = option.user;
          setMembers([
            ...members,
            {
              userId: user.userId,
              email: user.email,
              fullName: user.fullName,
              role: "Member",
              userType: user.userType, // Store user type for display
            },
          ]);
        } else {
          const student = option.student;
          setMembers([
            ...members,
            {
              userId: student.userId,
              email: student.email,
              fullName: student.fullName,
              role: "Member",
            },
          ]);
        }
        setEmailInput("");
      } else {
        message.error("This member is already added!");
      }
    } else {
      message.warning(`Maximum ${maxMembers} members allowed in a group!`);
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member.email !== email));
  };

  const handleRoleChange = (email, role) => {
    // If changing to Leader, first set everyone to Member
    if (role === "Leader") {
      setMembers(
        members.map((member) => ({
          ...member,
          role: "Member", // Set all to Member first
        }))
      );
    }

    // Then update the specific member's role
    setMembers(
      members.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
  };

  // Function to clear error
  const clearError = () => {
    setError(null);
  };

  // Function to validate form before submission
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // For students: Validate minimum number of members
    if (!isLecturer && members.length < 3) {
      errors.members = "Student groups need at least 3 other student members";
      isValid = false;
    }

    // For lecturers: Validate at least one member
    if (isLecturer && members.length < 1) {
      errors.members = "Please add at least one member to your group";
      isValid = false;
    }

    // Validate group name
    if (!form.getFieldValue("group_name")) {
      errors.group_name = "Please provide a group name";
      isValid = false;
    }

    // For students: Validate supervisor selection
    if (!isLecturer && !form.getFieldValue("lecturer_ids")?.length) {
      errors.supervisors = "Please select at least one supervisor";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Update onFinish to use the validation
  const onFinish = async (values) => {
    // Clear any previous errors
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the top where errors will be displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      // Check if any member is already assigned as Leader
      const hasLeader = members.some((member) => member.role === "Leader");

      // Map our string roles to the backend's number roles
      const getRoleNumber = (roleString) => {
        switch (roleString) {
          case "Leader":
            return 0;
          case "Member":
            return 1;
          default:
            return 1; // Default to Member
        }
      };

      // Get the full name from the user object in auth state
      const creatorName = user.fullName || user.full_name;

      // Only include memberName if we actually have it
      const creatorMember = {
        memberEmail: user.email,
        role: hasLeader ? 1 : 0, // If someone else is Leader, creator is Member (1)
      };

      // Only add the memberName if it exists
      if (creatorName) {
        creatorMember.memberName = creatorName;
      }

      // Process other members to ensure they have names when required
      const otherMembers = members.map((member) => {
        const memberObj = {
          memberEmail: member.email,
          role: getRoleNumber(member.role),
        };

        // Only include memberName if we have it
        if (member.fullName) {
          memberObj.memberName = member.fullName;
        }

        return memberObj;
      });

      // Start with creator and other members
      const allMembers = [creatorMember, ...otherMembers];

      // Add supervisors if this is a student group
      if (!isLecturer && values.lecturer_ids?.length) {
        const supervisors = values.lecturer_ids.map((id) => {
          const lecturer = lecturersData.lecturers.find((l) => l.userId === id);

          const supervisorObj = {
            memberEmail: lecturer.email,
            role: 2, // Supervisor role
          };

          // Only include memberName if we have it
          if (lecturer.fullName) {
            supervisorObj.memberName = lecturer.fullName;
          }

          return supervisorObj;
        });

        allMembers.push(...supervisors);
      }

      // Prepare the request payload
      const requestPayload = {
        groupName: values.group_name,
        members: allMembers,
      };

      // Call the API
      const response = await createResearchGroup(requestPayload).unwrap();

      message.success({
        content: "Group created successfully!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        duration: 5,
      });

      // Optionally, redirect to the groups page or clear the form
      form.resetFields();
      setMembers([]);
    } catch (error) {
      console.error("Failed to create group:", error);
      setError(error);

      // Scroll to the top where error will be displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to get label for lecturer in select
  const getLecturerLabel = (lecturer) => {
    return (
      <div className="flex items-center space-x-2 py-1">
        <Avatar icon={<UserOutlined />} className="bg-[#D2691E]" size="small" />
        <div className="flex flex-col">
          <span className="font-medium">{lecturer.fullName}</span>
          <div className="flex items-center text-xs text-gray-500">
            <span>{lecturer.email}</span>
            <span className="mx-1">•</span>
            <span>{lecturer.levelText}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Group</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLecturer
              ? "Create a research group for your research project"
              : "Form a capstone project group with your colleagues and supervisors"}
          </p>
          {isLecturer && (
            <div className="mt-2">
              <Tag color="blue" className="px-3 py-1">
                Research Group
              </Tag>
            </div>
          )}
          {!isLecturer && (
            <div className="mt-2">
              <Tag color="orange" className="px-3 py-1">
                Capstone Project Group
              </Tag>
            </div>
          )}
        </div>

        {/* Display error feedback if there's an error */}
        {error && <ErrorFeedback error={error} onClose={clearError} />}

        {/* Display form validation errors if any */}
        {Object.keys(formErrors).length > 0 && (
          <Alert
            type="warning"
            className="mb-6 rounded-lg shadow-sm"
            showIcon
            message="Please correct the following issues:"
            description={
              <ul className="list-disc list-inside mt-2">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field} className="text-amber-700">
                    {message}
                  </li>
                ))}
              </ul>
            }
            closable
            onClose={() => setFormErrors({})}
          />
        )}

        <Form
          form={form}
          name="create_group"
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              label="Group Name"
              name="group_name"
              rules={[{ required: true, message: "Please input group name!" }]}
              validateStatus={formErrors.group_name ? "error" : ""}
              help={formErrors.group_name}
            >
              <Input
                prefix={<TeamOutlined className="text-gray-400" />}
                placeholder="Enter group name"
                className="rounded-lg"
                onChange={() => {
                  if (formErrors.group_name) {
                    setFormErrors({ ...formErrors, group_name: undefined });
                  }
                }}
              />
            </Form.Item>
          </div>

          {/* Supervisors section - only show for students */}
          {!isLecturer && (
            <>
              <Divider>Supervisors</Divider>

              {isLoadingLecturers ? (
                <div className="flex justify-center py-4">
                  <Spin tip="Loading lecturers..." />
                </div>
              ) : isLecturersError ? (
                <Alert
                  message="Error loading lecturers"
                  description={
                    lecturersError?.message || "Please try again later"
                  }
                  type="error"
                  showIcon
                />
              ) : (
                <Form.Item
                  label="Select Supervisors"
                  name="lecturer_ids"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one supervisor!",
                    },
                    {
                      validator: (_, value) =>
                        value && value.length <= 2
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Maximum 2 supervisors allowed!")
                            ),
                    },
                  ]}
                  validateStatus={formErrors.supervisors ? "error" : ""}
                  help={formErrors.supervisors}
                >
                  <Select
                    mode="multiple"
                    placeholder="Search for supervisors by name or department (max 2)"
                    className="rounded-lg"
                    maxTagCount={2}
                    maxCount={2}
                    showSearch
                    filterOption={(input, option) => {
                      if (!input || !option) return true;

                      try {
                        // Create a comprehensive search string from all lecturer data
                        const lecturer = lecturersData?.lecturers?.find(
                          (l) => l.userId === option.value
                        );
                        if (lecturer) {
                          const searchStr =
                            `${lecturer.fullName} ${lecturer.email} ${lecturer.departmentName}`.toLowerCase();
                          return searchStr.includes(input.toLowerCase());
                        }

                        // Fallback to option label if lecturer not found
                        return String(option.label || "")
                          .toLowerCase()
                          .includes(input.toLowerCase());
                      } catch (error) {
                        console.error("Search filter error:", error);
                        return true; // Show the option if there's an error
                      }
                    }}
                    optionLabelProp="label"
                    dropdownRender={(menu) => (
                      <div>
                        <div className="px-3 pt-2 text-gray-500 text-xs">
                          <SearchOutlined /> Search by name, email or department
                          (max 2)
                        </div>
                        {menu}
                      </div>
                    )}
                    onChange={() => {
                      if (formErrors.supervisors) {
                        setFormErrors({
                          ...formErrors,
                          supervisors: undefined,
                        });
                      }
                    }}
                  >
                    {lecturersData?.lecturersByDepartment?.map((dept) => (
                      <Select.OptGroup
                        key={dept.departmentId}
                        label={
                          <div className="flex items-center font-medium text-gray-700 py-1">
                            <BankOutlined className="mr-2" />
                            {dept.departmentName}
                          </div>
                        }
                      >
                        {dept.lecturers.map((lecturer) => (
                          <Option
                            key={lecturer.userId}
                            value={lecturer.userId}
                            label={lecturer.fullName}
                          >
                            {getLecturerLabel(lecturer)}
                          </Option>
                        ))}
                      </Select.OptGroup>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </>
          )}

          <div className="mb-3">
            <Alert
              message="Group Leadership"
              description={
                <>
                  <p>You will be automatically added as the group creator.</p>
                  <p>
                    If you assign Leader role to another member, you will become
                    a regular Member.
                  </p>
                </>
              }
              type="info"
              showIcon
            />
          </div>

          <Divider>
            {isLecturer ? "Research Group Members" : "Student Members"}
          </Divider>

          {/* Member Addition - with error indication */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Members (max {maxMembers})
              </label>
              {formErrors.members && (
                <span className="text-red-500 text-sm">
                  {formErrors.members}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <AutoComplete
                value={emailInput}
                options={autoCompleteOptions}
                onSelect={handleSelectStudent}
                onChange={setEmailInput}
                onSearch={setEmailInput}
                style={{ width: "100%" }}
                placeholder={
                  isLecturer
                    ? "Search for students or lecturers by name or email"
                    : "Search for students by name or email"
                }
                notFoundContent={
                  emailInput ? (
                    <div className="p-2 text-gray-500">
                      No {isLecturer ? "users" : "students"} found. You can
                      still add this email manually.
                    </div>
                  ) : null
                }
              >
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className={`rounded-lg ${
                    formErrors.members ? "border-red-300" : ""
                  }`}
                  onPressEnter={handleAddMember}
                  suffix={
                    (
                      isLecturer ? isLoadingAcademicUsers : isLoadingStudents
                    ) ? (
                      <Spin size="small" />
                    ) : null
                  }
                  onChange={() => {
                    if (formErrors.members && members.length > 0) {
                      setFormErrors({ ...formErrors, members: undefined });
                    }
                  }}
                />
              </AutoComplete>
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={handleAddMember}
                className={`rounded-lg ${
                  formErrors.members
                    ? "border-red-300 text-red-500 hover:text-red-700"
                    : "border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
                }`}
              >
                Add
              </Button>
            </div>
            <div className="mt-2 text-gray-500 text-xs flex justify-between">
              <span
                className={formErrors.members ? "text-red-500 font-medium" : ""}
              >
                {members.length} of {maxMembers} members added
                {!isLecturer && (
                  <span className="ml-1">
                    ({!isLecturer ? "minimum 3 required" : ""})
                  </span>
                )}
              </span>
              {(isLecturer ? isAcademicUsersError : isStudentsError) && (
                <span className="text-red-500">
                  Error loading {isLecturer ? "user" : "student"} data. Manual
                  entry is still available.
                </span>
              )}
            </div>
          </div>

          {/* Member Tags with Role Selection */}
          <div className="mb-6">
            <Space size={12} wrap>
              {members.map((member) => (
                <div
                  key={member.email}
                  className="rounded-lg border border-orange-200 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100 flex items-center pr-1 mb-2 overflow-hidden"
                  style={{ maxWidth: "100%", minWidth: "300px" }}
                >
                  <div className="flex items-center flex-grow p-2">
                    <Avatar
                      icon={<UserOutlined />}
                      size="small"
                      className={`flex-shrink-0 ${
                        member.userType === "Lecturer"
                          ? "bg-[#1890ff]"
                          : "bg-[#D2691E]"
                      }`}
                    />

                    <div className="flex flex-col ml-2 min-w-0 flex-grow">
                      {member.fullName ? (
                        <>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 truncate">
                              {member.fullName}
                            </span>
                            {member.userType && (
                              <Tag
                                color={
                                  member.userType === "Lecturer"
                                    ? "blue"
                                    : "orange"
                                }
                                className="ml-2 text-xs px-1 py-0"
                              >
                                {member.userType}
                              </Tag>
                            )}
                          </div>
                          <Tooltip title={member.email}>
                            <span className="text-xs text-gray-500 truncate block">
                              {member.email}
                            </span>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title={member.email}>
                          <span className="text-gray-800 truncate block">
                            {member.email}
                          </span>
                        </Tooltip>
                      )}
                    </div>

                    <div className="flex-shrink-0 border-l border-orange-200 pl-2 ml-2">
                      <Select
                        value={member.role}
                        onChange={(value) =>
                          handleRoleChange(member.email, value)
                        }
                        bordered={false}
                        style={{ width: 120 }}
                        dropdownMatchSelectWidth={false}
                        popupClassName="rounded-lg shadow-lg"
                        className="flex items-center"
                        suffixIcon={
                          <div className="text-orange-400 ml-2">▼</div>
                        }
                        showArrow={true}
                      >
                        <Option value="Leader">
                          <div className="flex items-center">
                            <CrownOutlined className="mr-1 text-[#F2722B]" />
                            <span>Leader</span>
                          </div>
                        </Option>
                        <Option value="Member">
                          <div className="flex items-center">
                            <UserOutlined className="mr-1 text-gray-400" />
                            <span>Member</span>
                          </div>
                        </Option>
                      </Select>
                    </div>

                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemoveMember(member.email)}
                      className="text-gray-400 hover:text-red-500 hover:bg-transparent ml-1 flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
            </Space>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              icon={<SaveOutlined />}
              className="rounded-lg border-[#F2722B] text-[#F2722B] hover:text-[#D2691E] hover:border-[#D2691E]"
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={isCreating}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Create Group
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateGroup;
