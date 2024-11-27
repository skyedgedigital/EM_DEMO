"use server";

import connectToDB from "@/lib/database";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";
import { EsiLocationSchema } from "@/lib/models/HR/EsiLocation.model";
import { DepartmentHrSchema } from "@/lib/models/HR/department_hr";
import { DesignationSchema } from "@/lib/models/HR/designation.model";
import { SiteMasterSchema } from "@/lib/models/HR/siteMaster.model";
import Wages from "@/lib/models/HR/wages.model";
import WagesSchema from "@/lib/models/HR/wages.model";
import mongoose from "mongoose";

const departmentHrModel = mongoose.models.DepartmentHr || mongoose.model("DepartmentHr", DepartmentHrSchema);
const siteMasterModel = mongoose.models.Site || mongoose.model("Site", SiteMasterSchema)
const designationModel = mongoose.models.Designation || mongoose.model("Designation", DesignationSchema)
const EsiLocationModel = mongoose.models.EsiLocation || mongoose.model("EsiLocation", EsiLocationSchema)

const fetchEmployees = async (page = 1, pageSize = 15) => {
  try {
    console.log("okayyyy")
    await connectToDB();
    console.log(page)
    const skipCount = (page - 1) * pageSize;
    const docs = await EmployeeData.find({}).sort({
      date: -1
    })
      .skip(skipCount)
      .limit(pageSize).populate("designation")
    return {
      success: true,
      status: 200,
      message: 'Fetched',
      data: JSON.stringify(docs)
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const fetchEmployeesLazyLoading = async (page = 1, pageSize = 15) => {
  try {
    console.log("Fetching employees with lazy loading...");

    // Connect to the database
    await connectToDB();

    // Calculate the number of documents to skip
    const skipCount = (page - 1) * pageSize;

    // Query the database to fetch the employees
    const docs = await EmployeeData.find({})
      .sort({ date: -1 }) // Sorting by the 'date' field in descending order
      .skip(skipCount)     // Skip 'skipCount' number of documents
      .limit(pageSize)     // Limit the result set to 'pageSize' number of documents
      .populate("designation");  // Populate the 'designation' field with related data

    // Count the total number of documents (for total pages calculation)
    const totalDocs = await EmployeeData.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalDocs / pageSize);

    // Return the result with pagination info
    return {
      success: true,
      status: 200,
      message: 'Fetched',
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalItems: totalDocs,
      data: JSON.stringify(docs) // Return the documents as they are, no need to stringify
    };

  } catch (err) {
    console.log("Error fetching employees:", err);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};


const fetchAllEmployees = async () => {
  try {
    console.log("yahaan toh hain")
    await connectToDB();

    const docs = await EmployeeData.find({}).sort({
      date: -1
    })
      .populate("designation")
    return {
      success: true,
      status: 200,
      message: 'Fetched',
      data: JSON.stringify(docs)
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

// new function to fetch all the employee has atleast one work order assigned

const fetchEmployeesWithWorkorderHr = async () => {
  try {
    console.log("Fetching employees with non-empty workOrderHr");
    await connectToDB();

    // Query to find employees where workOrderHr array has at least one element
    const docs = await EmployeeData.find({ workOrderHr: { $exists: true, $not: { $size: 0 } } })
      .sort({ date: -1 }) // Sort by date in descending order
      .populate("designation"); // Populate the 'designation' field

    return {
      success: true,
      status: 200,
      message: "Fetched all employees with workorder",
      data: JSON.stringify(docs),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const fetchEmployeeByName = async (name) => {
  try {
    await connectToDB();
    const resp = await EmployeeData.findOne(

      { name: name.name }

    )
    return {
      success: true,
      status: 200,
      message: 'Details Fetched',
      data: JSON.stringify(resp)
    }
  }
  catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
}

const fetchEmployeeByCode = async (code: string) => {
  try {
    await connectToDB();
    const resp = await EmployeeData.findOne({
      employeeDetails: {
        code: code
      }
    })
    return {
      success: true,
      status: 200,
      message: 'Details Fetched',
      data: JSON.stringify(resp)
    }
  }
  catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
}

const fetchEmployeeById = async (docId: any) => {
  try {
    await connectToDB();
    const resp = await EmployeeData.findOne({ _id: docId })
      .populate("department")
      .populate("site")
      .populate("designation")
      .populate("ESILocation")
    return {
      success: true,
      message: "Fetched Data",
      status: 200,
      data: JSON.stringify(resp)
    }
  }
  catch (err) {
    console.log(err)
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
}

const fetchEmployeeByDep = async (dep: any) => {
  try {
    await connectToDB();
    const dept = JSON.parse(dep)
    const resp = await EmployeeData.find({ department: dept })
      .populate("department")
      .populate("site")
      .populate("designation")
      .populate("ESILocation")
    return {
      success: true,
      message: "Fetched Data",
      status: 200,
      data: JSON.stringify(resp)
    }
  }
  catch (err) {
    console.log(err)
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
}

const fetchCompliancesByMonthYear = async (month, year) => {
  try {
    await connectToDB();

    // Convert month and year to a date range
    // const startDate = new Date(year, month - 1, 1); // First day of the month
    // const endDate = new Date(year, month, 0); // Last day of the month

    // Fetch compliances within the specified date range
    const resp = await Wages.find({
      month: month,
      year: year
    })
      .populate("designation")
      .populate("employee")
      .populate("workOrderHr");

    console.log("here is the server response for compliences", resp);

    return {
      success: true,
      message: "Fetched Compliances Data for Specified Month and Year",
      status: 200,
      data: JSON.stringify(resp)
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
}


export { fetchEmployees, fetchEmployeeByName, fetchEmployeeByCode, fetchEmployeeById, fetchAllEmployees, fetchEmployeeByDep, fetchEmployeesLazyLoading, fetchCompliancesByMonthYear, fetchEmployeesWithWorkorderHr }