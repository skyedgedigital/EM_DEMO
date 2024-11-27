"use server";
import connectToDB from "@/lib/database";
import Employee from "@/lib/models/employee.model";
import { employee } from "@/types/employee.type";

const getEmployee = async (employeeInfo: employee) => {
  try {
    await connectToDB();
    var employee = await Employee.findOne(employeeInfo);
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Internal server Error",
      error: JSON.stringify(error),
    };
  }
  if (!employee) {
    return {
      success: false,
      status: 404,
      message: "Employee not found",
    };
  }
  return {
    success: true,
    status: 200,
    message: "Employee found",
    data: employee,
  };
};

const fetchAllEmployees = async () => {
  try {
    await connectToDB();
    const result = await Employee.find({});
    return {
      success: true,
      status: 200,
      message: "List of All Employees",
      data: JSON.stringify(result),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: JSON.stringify(err),
    };
  }
};

const fetchEmpByPhoneNumber = async (phone: string) => {
  try {
    await connectToDB();
    const resp = await Employee.findOne({
      phoneNo: parseInt(phone,10),
    });
    if (!resp) {
      return {
        success: false,
        status: 404,
        message: "Emp not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Employee found",
      data: resp,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server Error",
      status: 500,
      err: JSON.stringify(err),
    };
  }
};

export { getEmployee, fetchAllEmployees , fetchEmpByPhoneNumber };
