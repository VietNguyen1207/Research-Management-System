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
  Progress,
  Modal,
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
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  SolutionOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  WarningOutlined,
  ClearOutlined,
  CheckCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useGetLecturersQuery,
  useGetStudentsQuery,
  useGetAcademicUsersQuery,
} from "../features/user/userApiSlice";
import { useCreateResearchGroupMutation } from "../features/group/groupApiSlice";
import ErrorFeedback from "../components/ErrorFeedback";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateGroup = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [createdGroupName, setCreatedGroupName] = useState("");
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderEmail, setStakeholderEmail] = useState("");
  const [stakeholderName, setStakeholderName] = useState("");

  // Check if user is a lecturer or researcher
  const isLecturer = user?.role === "lecturer" || user?.role === "researcher";

  // Set member limit based on role
  const maxMembers = isLecturer ? 10 : 5;

  // Fetch lecturers and students
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

  const {
    data: academicUsers,
    isLoading: isLoadingAcademicUsers,
    isError: isAcademicUsersError,
    refetch: refetchAcademicUsers,
  } = useGetAcademicUsersQuery(undefined, { skip: !isLecturer });

  // Add the create mutation
  const [createResearchGroup, { isLoading: isCreating }] =
    useCreateResearchGroupMutation();

  // Get the navigate function
  const navigate = useNavigate();

  // Update autocomplete options based on user role
  useEffect(() => {
    if (!emailInput) {
      setAutoCompleteOptions([]);
      return;
    }

    const inputLower = emailInput.toLowerCase();

    if (isLecturer && academicUsers) {
      // Debug log to check if researchers are included
      console.log("Academic users data:", academicUsers);

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
                user.userType === "Lecturer" || user.userType === "Researcher"
                  ? "bg-[#1890ff]"
                  : "bg-[#D2691E]"
              }
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium">{user.fullName}</span>
                <Tag
                  color={
                    user.userType === "Lecturer" ||
                    user.userType === "Researcher"
                      ? "blue"
                      : "orange"
                  }
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

  // Add useEffect to refetch data when component mounts
  useEffect(() => {
    if (isLecturer && refetchAcademicUsers) {
      refetchAcademicUsers();
    }
  }, [isLecturer, refetchAcademicUsers]);

  const handleAddMember = () => {
    // Calculate the actual max members based on role
    const actualMaxMembers = isLecturer ? maxMembers : maxMembers - 1;

    if (emailInput && members.length < actualMaxMembers) {
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
    } else if (members.length >= actualMaxMembers) {
      message.warning(
        `Maximum ${actualMaxMembers} additional members allowed in a group!`
      );
    }
  };

  const handleSelectStudent = (email, option) => {
    // Calculate the actual max members based on role
    const actualMaxMembers = isLecturer ? maxMembers : maxMembers - 1;

    if (members.length < actualMaxMembers) {
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
      message.warning(
        `Maximum ${actualMaxMembers} additional members allowed in a group!`
      );
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member.email !== email));
  };

  const handleRoleChange = (email, role) => {
    // Create a copy of the current members array to work with
    let updatedMembers = [...members];

    // Check if we're trying to assign a new Leader
    if (role === "Leader") {
      // Find if there's already a Leader in the members
      const existingLeaderIndex = updatedMembers.findIndex(
        (member) => member.role === "Leader"
      );

      const existingLeader =
        existingLeaderIndex !== -1 ? updatedMembers[existingLeaderIndex] : null;

      if (existingLeader && existingLeader.email !== email) {
        // Show confirmation dialog but already update the UI
        // Set everyone to Member first, then set the new Leader
        updatedMembers = updatedMembers.map((member) => ({
          ...member,
          role: member.email === email ? "Leader" : "Member",
        }));

        // Update state with a single call to prevent race conditions
        setMembers(updatedMembers);

        // Show confirmation dialog
        Modal.confirm({
          title: "Change Group Leader",
          content: (
            <div>
              <p>
                {existingLeader.fullName || existingLeader.email} was the
                Leader.
              </p>
              <p>
                {members.find((m) => m.email === email)?.fullName || email} is
                now the new Leader.
              </p>
              <p className="text-amber-600 mt-2">
                Note: There can only be one Leader in a group.
              </p>
            </div>
          ),
          okText: "Confirm Change",
          okButtonProps: { className: "bg-[#F2722B] border-[#F2722B]" },
          cancelText: "Undo",
          onOk: () => {
            // Already updated, just show confirmation message
            message.success({
              content: `${
                members.find((m) => m.email === email)?.fullName || email
              } is now the Leader`,
              icon: <CrownOutlined style={{ color: "#F2722B" }} />,
            });
          },
          onCancel: () => {
            // If user cancels, revert back to previous state
            const revertedMembers = members.map((member) => ({
              ...member,
              role:
                member.email === existingLeader.email
                  ? "Leader"
                  : member.email === email
                  ? "Member"
                  : member.role,
            }));

            setMembers(revertedMembers);

            message.info({
              content: `Reverted leader back to ${
                existingLeader.fullName || existingLeader.email
              }`,
              icon: <CrownOutlined style={{ color: "#F2722B" }} />,
            });
          },
        });
        return;
      }

      // If no existing Leader (or the current member is already the Leader),
      // update all members in a single state update
      updatedMembers = updatedMembers.map((member) => ({
        ...member,
        role: member.email === email ? "Leader" : "Member",
      }));

      setMembers(updatedMembers);

      message.success({
        content: `${
          members.find((m) => m.email === email)?.fullName || email
        } is now the Leader`,
        icon: <CrownOutlined style={{ color: "#F2722B" }} />,
      });
    } else {
      // If changing from Leader to Member, check if this is the only Leader
      const currentMember = members.find((member) => member.email === email);
      if (currentMember?.role === "Leader") {
        // Warn that there will be no Leader
        Modal.confirm({
          title: "Remove Leader",
          content: (
            <div>
              <p>
                This will remove the Leader role from{" "}
                {currentMember.fullName || currentMember.email}.
              </p>
              <p className="text-amber-600 mt-2">
                Your group will have no Leader. You should assign another member
                as Leader.
              </p>
            </div>
          ),
          okText: "Continue",
          okButtonProps: { className: "bg-[#F2722B] border-[#F2722B]" },
          cancelText: "Cancel",
          onOk: () => {
            // Update in a single state call
            const newMembers = members.map((member) =>
              member.email === email ? { ...member, role } : member
            );

            setMembers(newMembers);

            message.warning({
              content: "Your group now has no Leader",
              icon: <InfoCircleOutlined style={{ color: "#faad14" }} />,
            });
          },
        });
        return;
      }

      // For any other role change that's not from Leader to Member
      // Update in a single state call
      const newMembers = members.map((member) =>
        member.email === email ? { ...member, role } : member
      );

      setMembers(newMembers);

      message.success({
        content: `Role updated for ${
          members.find((m) => m.email === email)?.fullName || email
        }`,
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    }
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

      // Map string roles to the backend's number roles
      const getRoleNumber = (roleString) => {
        switch (roleString) {
          case "Leader":
            return 0;
          case "Member":
            return 1;
          default:
            return 1;
        }
      };

      // Get the full name from the user object in auth state
      const creatorName = user.fullName || user.full_name;

      // Only include memberName if we actually have it
      const creatorMember = {
        memberEmail: user.email,
        role: hasLeader ? 1 : 0,
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

      // Add stakeholders if there are any
      if (stakeholders.length > 0) {
        const stakeholderMembers = stakeholders.map((stakeholder) => {
          const stakeholderObj = {
            memberEmail: stakeholder.email,
            role: 6, // Stakeholder role
          };

          // Only include memberName if provided
          if (stakeholder.name) {
            stakeholderObj.memberName = stakeholder.name;
          }

          return stakeholderObj;
        });

        allMembers.push(...stakeholderMembers);
      }

      // Prepare the request payload
      const requestPayload = {
        groupName: values.group_name,
        members: allMembers,
      };

      // Call the API
      const response = await createResearchGroup(requestPayload).unwrap();

      // Save the group name for the success modal
      setCreatedGroupName(values.group_name);

      // Show the success modal instead of the message
      setIsSuccessModalVisible(true);

      // Reset form and state
      form.resetFields();
      setMembers([]);
      setStakeholders([]);
    } catch (error) {
      console.error("Failed to create group:", error);
      setError(error);

      // Scroll to the top where error will be displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Add this function to handle navigation
  const handleViewGroups = () => {
    setIsSuccessModalVisible(false);
    navigate("/view-group");
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

  const handleAddStakeholder = () => {
    if (!stakeholderEmail) {
      message.error("Stakeholder email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stakeholderEmail)) {
      message.error("Please enter a valid email address");
      return;
    }

    // Check if stakeholder already exists
    if (stakeholders.some((s) => s.email === stakeholderEmail)) {
      message.error("This stakeholder is already added");
      return;
    }

    // Check if email is already used as a member
    if (members.some((m) => m.email === stakeholderEmail)) {
      message.error("This email is already added as a group member");
      return;
    }

    setStakeholders([
      ...stakeholders,
      {
        email: stakeholderEmail,
        name: stakeholderName || null,
      },
    ]);

    // Reset the inputs
    setStakeholderEmail("");
    setStakeholderName("");

    message.success("Stakeholder added successfully");
  };

  const handleRemoveStakeholder = (email) => {
    setStakeholders(stakeholders.filter((s) => s.email !== email));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 rounded-full mb-4">
              <TeamOutlined className="text-4xl text-[#F2722B]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Create New Group
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
              {isLecturer
                ? "Create a research group for your academic project with collaborators and students"
                : "Form a capstone project group with your colleagues and supervisors for your final project"}
            </p>
            <div className="mt-3 flex justify-center items-center space-x-3">
              {isLecturer ? (
                <Tag
                  color="blue"
                  className="px-4 py-1 rounded-full text-sm font-medium"
                >
                  Research Group
                </Tag>
              ) : (
                <Tag
                  color="orange"
                  className="px-4 py-1 rounded-full text-sm font-medium"
                >
                  Capstone Project Group
                </Tag>
              )}
              <Tag className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {maxMembers} members max
              </Tag>
            </div>
          </div>
        </div>

        {/* Display error feedback if there's an error */}
        {error && <ErrorFeedback error={error} onClose={clearError} />}

        {/* Display form validation errors if any */}
        {Object.keys(formErrors).length > 0 && (
          <Alert
            type="warning"
            className="mb-6 rounded-lg shadow-md border border-amber-200 animate-fadeIn"
            showIcon
            icon={<ExclamationCircleOutlined className="text-amber-500" />}
            message={
              <span className="font-medium text-amber-800">
                Please address the following issues:
              </span>
            }
            description={
              <ul className="list-disc list-inside mt-2 space-y-1">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field} className="text-amber-700 flex items-start">
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            }
            closable
            onClose={() => setFormErrors({})}
            action={
              <Button
                size="small"
                type="link"
                onClick={() => setFormErrors({})}
                className="text-amber-700 hover:text-amber-900"
              >
                Dismiss
              </Button>
            }
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
              label={
                <div className="flex items-center space-x-2">
                  <span>Group Name</span>
                  <Tooltip title="Choose a descriptive name that reflects your research focus">
                    <InfoCircleOutlined className="text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
              }
              name="group_name"
              rules={[{ required: true, message: "Please input group name!" }]}
              validateStatus={formErrors.group_name ? "error" : ""}
              help={formErrors.group_name}
            >
              <Input
                prefix={<TeamOutlined className="text-gray-400" />}
                placeholder="Enter group name"
                className="rounded-lg py-2"
                onChange={() => {
                  if (formErrors.group_name) {
                    setFormErrors({ ...formErrors, group_name: undefined });
                  }
                }}
                maxLength={50}
                showCount
                autoComplete="off"
              />
            </Form.Item>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-500">
                  <InfoCircleOutlined />
                </div>
                <div>
                  <div className="font-medium text-blue-700">
                    Choose a descriptive name
                  </div>
                  <div className="text-sm text-blue-600">
                    Good examples: "AI Research Collective", "Database
                    Performance Team", "ML in Healthcare Group"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supervisors section - only show for students */}
          {!isLecturer && (
            <>
              <Divider className="my-6">
                <div className="flex items-center space-x-2">
                  <SolutionOutlined className="text-[#F2722B]" />
                  <span className="font-medium">Supervisors</span>
                </div>
              </Divider>

              {isLoadingLecturers ? (
                <div className="flex justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="flex flex-col items-center">
                    <Spin size="large" />
                    <span className="mt-3 text-gray-500">
                      Loading supervisors...
                    </span>
                  </div>
                </div>
              ) : isLecturersError ? (
                <Alert
                  message="Error loading supervisors"
                  description={
                    <div>
                      <p>
                        {lecturersError?.message || "Please try again later"}
                      </p>
                      <Button type="link" onClick={() => /* refetch */ {}}>
                        Retry
                      </Button>
                    </div>
                  }
                  type="error"
                  showIcon
                  className="mb-6 shadow-sm"
                />
              ) : (
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Form.Item
                    label={
                      <div className="flex items-center mb-2">
                        <UserOutlined className="mr-2 text-[#D2691E]" />
                        <span className="font-medium">Select Supervisors</span>
                      </div>
                    }
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
                    extra={
                      <span className="text-gray-500 text-sm flex items-center mt-1">
                        <InfoCircleOutlined className="mr-1" />
                        Supervisors will guide your project and evaluate your
                        work
                      </span>
                    }
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
                          <div className="px-3 pt-2 pb-1 bg-gray-50 border-b border-gray-200 flex items-center">
                            <SearchOutlined className="text-gray-400 mr-2" />
                            <span className="text-xs text-gray-500">
                              Search by name, email or department (max 2)
                            </span>
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
                            <div className="flex items-center font-medium text-gray-700 py-1 bg-gray-50 pl-2 -ml-2 -mr-2">
                              <BankOutlined className="mr-2 text-gray-600" />
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
                </div>
              )}
            </>
          )}

          <div className="mb-5 mt-3">
            <Alert
              message={
                <div className="font-medium flex items-center">
                  <CrownOutlined className="mr-2 text-yellow-500" />
                  Group Leadership
                </div>
              }
              description={
                <div className="mt-2 space-y-2">
                  <div className="flex items-start">
                    <div className="bg-blue-50 rounded-full p-1 mr-2 mt-0.5">
                      <UserOutlined className="text-blue-500 text-xs" />
                    </div>
                    <p>You will be automatically added as the group creator.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-50 rounded-full p-1 mr-2 mt-0.5">
                      <SwapOutlined className="text-orange-500 text-xs" />
                    </div>
                    <p>
                      If you assign Leader role to another member, you will
                      become a regular Member.
                    </p>
                  </div>
                </div>
              }
              type="info"
              showIcon={false}
              className="rounded-lg border-blue-200 bg-blue-50"
            />
          </div>

          <Divider className="my-6">
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-[#F2722B]" />
              <span className="font-medium">
                {isLecturer ? "Research Group Members" : "Student Members"}
              </span>
            </div>
          </Divider>

          {/* Member Addition - with error indication */}
          <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center text-base font-medium text-gray-700">
                <UserAddOutlined className="mr-2 text-[#D2691E]" />
                Add Members{" "}
                <span className="text-gray-500 text-sm ml-1">
                  (max {maxMembers})
                </span>
              </label>
              {formErrors.members && (
                <div className="text-red-500 text-sm flex items-center">
                  <ExclamationCircleOutlined className="mr-1" />
                  {formErrors.members}
                </div>
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
                    ? "Search for students, lecturers, or researchers by name or email"
                    : "Search for students by name or email"
                }
                notFoundContent={
                  emailInput ? (
                    <div className="p-3 text-gray-500 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <SearchOutlined className="text-gray-300 text-xl mb-2" />
                        <span>
                          No {isLecturer ? "users" : "students"} found
                        </span>
                        <span className="text-xs mt-1">
                          You can still add this email manually
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-gray-500 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <TeamOutlined className="text-gray-300 text-xl mb-2" />
                        <span>
                          Type to search for{" "}
                          {isLecturer
                            ? "users (students, lecturers, researchers)"
                            : "students"}
                        </span>
                      </div>
                    </div>
                  )
                }
              >
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className={`rounded-lg py-2 ${
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddMember}
                className={`rounded-lg ${
                  formErrors.members
                    ? "bg-red-100 border-red-300 text-red-700 hover:text-red-800 hover:border-red-400 hover:bg-red-200"
                    : "bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none text-white"
                }`}
              >
                Add
              </Button>
              {isLecturer && (
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    refetchAcademicUsers();
                    message.info("Refreshing user list...");
                  }}
                  title="Refresh user list"
                />
              )}
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div
                className={`flex items-center space-x-1 ${
                  formErrors.members
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                } text-sm`}
              >
                <Progress
                  percent={Math.min(
                    100,
                    (members.length /
                      (isLecturer ? maxMembers : maxMembers - 1)) *
                      100
                  )}
                  size="small"
                  showInfo={false}
                  strokeColor={formErrors.members ? "#f5222d" : "#F2722B"}
                  className="w-24 mr-2"
                />
                <span>
                  {members.length} of {isLecturer ? maxMembers : maxMembers - 1}{" "}
                  members added
                  {!isLecturer && members.length < 3 && (
                    <span className="ml-1">(minimum 3 required)</span>
                  )}
                </span>
              </div>
              {(isLecturer ? isAcademicUsersError : isStudentsError) && (
                <span className="text-red-500 text-xs flex items-center">
                  <WarningOutlined className="mr-1" />
                  Error loading data. Manual entry available.
                </span>
              )}
            </div>
          </div>

          {/* Member Tags with Role Selection */}
          <div className="mb-6">
            {members.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <TeamOutlined className="text-gray-300 text-4xl mb-3" />
                <div className="text-gray-500">No members added yet</div>
                <div className="text-xs text-gray-400 mt-1">
                  Use the search box above to add members
                </div>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
                {members.map((member, index) => (
                  <div
                    key={member.email}
                    className="rounded-lg border border-orange-200 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center w-full">
                      <div className="py-3 px-4 flex items-center w-full">
                        {/* Avatar with badge - fixed width */}
                        <div className="flex-shrink-0 mr-3">
                          <Badge
                            count={index + 1}
                            overflowCount={99}
                            style={{ backgroundColor: "#F2722B" }}
                          >
                            <Avatar
                              icon={<UserOutlined />}
                              size="default"
                              className={
                                member.userType === "Lecturer" ||
                                member.userType === "Researcher"
                                  ? "bg-[#1890ff]"
                                  : "bg-[#D2691E]"
                              }
                            />
                          </Badge>
                        </div>

                        {/* Member info - with flex-grow and min-width */}
                        <div className="flex-grow min-w-0 mr-3">
                          {member.fullName ? (
                            <>
                              <Tooltip title={member.fullName}>
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-800 truncate block max-w-[140px]">
                                    {member.fullName}
                                  </span>
                                  {member.userType && (
                                    <Tag
                                      color={
                                        member.userType === "Lecturer" ||
                                        member.userType === "Researcher"
                                          ? "blue"
                                          : "orange"
                                      }
                                      className="ml-2 text-xs px-1.5 py-0 flex-shrink-0"
                                    >
                                      {member.userType}
                                    </Tag>
                                  )}
                                </div>
                              </Tooltip>
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

                        {/* Role selector - fixed width */}
                        <div className="flex-shrink-0 border-l border-orange-200 pl-3 w-[120px]">
                          <Select
                            value={member.role}
                            onChange={(value) =>
                              handleRoleChange(member.email, value)
                            }
                            bordered={false}
                            style={{ width: 100 }}
                            dropdownMatchSelectWidth={false}
                            popupClassName="rounded-lg shadow-lg"
                            suffixIcon={null}
                          >
                            <Option value="Leader">
                              <div className="flex items-center py-1">
                                <CrownOutlined className="mr-2 text-[#F2722B]" />
                                <span>Leader</span>
                              </div>
                            </Option>
                            <Option value="Member">
                              <div className="flex items-center py-1">
                                <UserOutlined className="mr-2 text-gray-400" />
                                <span>Member</span>
                              </div>
                            </Option>
                          </Select>
                        </div>

                        {/* Delete button - fixed width */}
                        <div className="flex-shrink-0">
                          <Tooltip title="Remove member">
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveMember(member.email)}
                              className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* After the member section, add a new stakeholder section */}
          <Divider className="my-6">
            <div className="flex items-center space-x-2">
              <SolutionOutlined className="text-[#F2722B]" />
              <span className="font-medium">Stakeholders</span>
            </div>
          </Divider>

          <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center text-base font-medium text-gray-700">
                <UserAddOutlined className="mr-2 text-[#D2691E]" />
                Add Stakeholders
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Stakeholder Email"
                prefix={<MailOutlined className="text-gray-400" />}
                value={stakeholderEmail}
                onChange={(e) => setStakeholderEmail(e.target.value)}
                className="rounded-lg py-2"
              />
              <Input
                placeholder="Stakeholder Name (Optional)"
                prefix={<UserOutlined className="text-gray-400" />}
                value={stakeholderName}
                onChange={(e) => setStakeholderName(e.target.value)}
                className="rounded-lg py-2"
              />
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddStakeholder}
              className="rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Add Stakeholder
            </Button>

            {/* Stakeholder list */}
            <div className="mt-4">
              {stakeholders.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
                  {stakeholders.map((stakeholder, index) => (
                    <div
                      key={stakeholder.email}
                      className="rounded-lg border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center w-full">
                        <div className="py-3 px-4 flex items-center w-full">
                          <div className="flex-shrink-0 mr-3">
                            <Badge
                              count={index + 1}
                              overflowCount={99}
                              style={{ backgroundColor: "#1890ff" }}
                            >
                              <Avatar
                                icon={<UserOutlined />}
                                size="default"
                                className="bg-[#1890ff]"
                              />
                            </Badge>
                          </div>
                          <div className="flex-grow min-w-0 mr-3">
                            {stakeholder.name ? (
                              <>
                                <Tooltip title={stakeholder.name}>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-800 truncate block max-w-[140px]">
                                      {stakeholder.name}
                                    </span>
                                    <Tag
                                      color="cyan"
                                      className="ml-2 text-xs px-1.5 py-0 flex-shrink-0"
                                    >
                                      Stakeholder
                                    </Tag>
                                  </div>
                                </Tooltip>
                              </>
                            ) : null}
                            <Tooltip title={stakeholder.email}>
                              <span className="text-xs text-gray-500 truncate block">
                                {stakeholder.email}
                              </span>
                            </Tooltip>
                          </div>
                          <div className="flex-shrink-0">
                            <Tooltip title="Remove stakeholder">
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  handleRemoveStakeholder(stakeholder.email)
                                }
                                className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <TeamOutlined className="text-gray-300 text-3xl mb-2" />
                  <div className="text-gray-500">No stakeholders added yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <div>
              <Tooltip title="Clear all form fields and start over">
                <Button
                  icon={<ClearOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: "Reset form?",
                      content:
                        "This will clear all fields and remove all added members. Continue?",
                      okText: "Yes, reset",
                      cancelText: "Cancel",
                      onOk: () => {
                        form.resetFields();
                        setMembers([]);
                        setStakeholders([]);
                        setError(null);
                        setFormErrors({});
                      },
                    });
                  }}
                  className="mr-2"
                >
                  Reset
                </Button>
              </Tooltip>
            </div>

            <div className="flex space-x-3">
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
                size="large"
              >
                Create Group
              </Button>
            </div>
          </div>
        </Form>
      </div>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalVisible}
        footer={null}
        closable={false}
        centered
        className="success-creation-modal"
        width={400}
      >
        <div className="flex flex-col items-center py-4">
          <div className="mb-6 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircleFilled className="text-5xl text-green-500" />
          </div>

          <h3 className="text-xl font-bold text-center mb-2">
            Group Created Successfully!
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Your group <span className="font-medium">"{createdGroupName}"</span>{" "}
            has been created successfully.
          </p>

          <div className="flex flex-col w-full space-y-3">
            <Button
              type="primary"
              size="large"
              onClick={handleViewGroups}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              View My Groups
            </Button>

            <Button
              onClick={() => setIsSuccessModalVisible(false)}
              size="large"
              className="w-full"
            >
              Create Another Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGroup;
