import React from "react";
import { Input, Checkbox, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {/* Form Section */}
        <Form
          name="login"
          className="mt-8 space-y-6"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-sm mr-1" />}
                placeholder="Email address"
                className="h-9 appearance-none rounded-lg relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F2722B] focus:border-[#F2722B] focus:z-10 text-sm flex items-center"
                size="large"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-sm mr-1" />}
                placeholder="Password"
                className="h-9 appearance-none rounded-lg relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F2722B] focus:border-[#F2722B] focus:z-10 text-sm flex items-center"
                size="large"
              />
            </Form.Item>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" className="m-0">
              <Checkbox className="text-gray-500 hover:text-[#F2722B]">
                Remember me
              </Checkbox>
            </Form.Item>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[#F2722B] hover:text-[#D2691E]"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F2722B] transition-all duration-200"
            >
              Sign in
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <a
              href="#"
              className="font-medium text-[#F2722B] hover:text-[#D2691E]"
            >
              Sign up now
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
