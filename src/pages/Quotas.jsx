import React from "react";
import { Table, Card, Button, Input, Select } from "antd";
import { useSelector } from "react-redux";

const Quotas = () => {
  const lecturersData = [
    // Mock data with additional fields
    {
      key: 1,
      name: "Dr. Emily Smith",
      department: "Computer Science",
      numberOfResearch: 3,
      budget: 120000000,
      status: "Approved",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    // Add more mock data as needed
  ];

  const columns = [
    {
      title: "Lecturer",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      align: "center",
    },
    {
      title: "Number of Research Projects",
      dataIndex: "numberOfResearch",
      key: "numberOfResearch",
      align: "center",
    },
    {
      title: "Budget (VND)",
      dataIndex: "budget",
      key: "budget",
      align: "center",
      render: (text) => `₫${text.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          className="bg-[#FFA500] text-white hover:bg-[#FF8C00] font-bold"
          onClick={() => handleAction(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleAction = (record) => {
    console.log("Action for:", record);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Quota Overview</h2>
          <Input.Search placeholder="Search Lecturers" className="w-1/4" />
        </div>
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={lecturersData}
            pagination={{ pageSize: 5 }}
            rowClassName="align-top"
            className="custom-table"
          />
        </Card>
      </div>
    </div>
  );
};

export default Quotas;
