"use server";

import Attendance from "@/lib/models/HR/attendance.model";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";
import { EmployeeDataSchema } from "@/lib/models/HR/EmployeeData.model";
import mongoose from "mongoose";
import connectToDB from "@/lib/database";
import { WorkOrderHrSchema } from "@/lib/models/HR/workOrderHr.model";
import { DesignationSchema } from "@/lib/models/HR/designation.model";

const EmployeeDataModel =
  mongoose.models.EmployeeData || mongoose.model("EmployeeData", EmployeeDataSchema);
const WorkOrderHrModel = mongoose.models.WorkOrderHr || mongoose.model("WorkOrderHr",WorkOrderHrSchema)
const designationModel = mongoose.models.Designation || mongoose.model("Designation",DesignationSchema)

function getSundays(month: number, year: number) {
  console.log("Year", year);
  console.log("Month", month);
  let sundays = [];
  let date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    if (date.getDay() === 0) {
      console.log("Got Hit");
      sundays.push(date.getDate());
    }
    date.setDate(date.getDate() + 1);
  }
  return sundays;
}

const fetchAttendance = async (filter: string) => {
  try {
    const searchFilter = JSON.parse(filter);
    const resp = await Attendance.findOne(searchFilter).populate("workOrderHr");

    if (!resp) {
      // Function to get the number of days in a given month and year
      const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
      };

      // Generate the days array based on the month and year
      const daysInMonth = getDaysInMonth(searchFilter.year, searchFilter.month);
      const daysArray = Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        status: "Present",
      }));

      let sundays = getSundays(searchFilter.month,searchFilter.year);
      console.log("The Sundays ",sundays)

      for(let i=0;i<sundays.length;i++){
        console.log(daysArray[sundays[i]-1])
        daysArray[sundays[i]-1].status = "Not Paid"
      }

      // Create a new attendance with the generated days array
      const newAttendance = new Attendance({
        employee: searchFilter.employee,
        year: searchFilter.year,
        month: searchFilter.month,
        days: daysArray,  // Assign the generated days array here
      });

      // Save the newly created attendance
      await newAttendance.save();
      return {
        success: true,
        status: 200,
        data: JSON.stringify(newAttendance),
      };
    } else {
      console.log("Existing attendance found:", resp);
      return {
        success: true,
        status: 200,
        data: JSON.stringify(resp),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: JSON.stringify(err),
      success: false,
    };
  }
};



const fetchAllAttendance = async (filter: string) => {
  try {
    await connectToDB()

    const searchFilter = JSON.parse(filter);
    console.log(searchFilter)

    const resp = await Attendance.find(searchFilter).populate("employee").populate({
      path: "employee",
      populate: {
        path: "designation",
        model: "Designation",
      },
    });

    console.log("yera dfghjksj",resp)
    return {
      success: true,
      status: 200,
      data: JSON.stringify(resp),
    };
  } catch (err) {
    console.error(err)
    return {
      status: 500,
      message: JSON.stringify(err),
      success: false,
    };
  }
};

const fetchAllDepAttendance = async (filter: string) => {
  try {
    console.log("aatogayayayya")
    await connectToDB()

    const searchFilter = JSON.parse(filter);
    console.log(searchFilter)
    const { year, month, workOrder } = searchFilter; // Destructuring to extract year, month, and workOrder

  // Create the base filter with year and month
  const newFilter: Record<string, any> = { year, month };

   // Retrieve employees based on workOrderHr filter
   let employeeIds: mongoose.Types.ObjectId[] = [];

   if (workOrder !== "Default") {
     const period = `${month}-${year}`; // Format: 'mm-yyyy'

     // Find employees who have the specified workOrder in workOrderHr with the matching period
     const employeesWithWorkOrder = await EmployeeData.find({
       workOrderHr: {
         $elemMatch: {
           workOrderHr: workOrder,
           period: period,  // Ensure period matches 'mm-yyyy' format for the given month and year
         },
       },
     });

     // Extract the employee IDs
     employeeIds = employeesWithWorkOrder.map((emp) => emp._id);

     // Add employee IDs to filter
     newFilter.employee = { $in: employeeIds };
   }

   console.log("Attendance filter criteria:", newFilter);

  
   const resp = await Attendance.find(newFilter)
   .populate("employee")
   .populate({
     path: "employee",
     populate: {
       path: "designation",
       model: "Designation",
     },
   });

    console.log("yera dfghjksj",resp)
    return {
      success: true,
      status: 200,
      data: JSON.stringify(resp),
    };
  } catch (err) {
    console.error(err)
    return {
      status: 500,
      message: JSON.stringify(err),
      success: false,
    };
  }
};

const fetchStatus = async (filter: string) => {
  try {
    const searchFilter = JSON.parse(filter);
    const resp = await Attendance.findOne(searchFilter);
    const daysArray = resp.days;
    let obj = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Off:0
    };
    daysArray.forEach((ele: any) => {
      if (ele.status == "Present") {
        obj["Present"] = obj["Present"] + 1;
      } else if (ele.status == "Absent") {
        obj["Absent"] = obj["Absent"] + 1;
      } else if (ele.status == "Leave") {
        obj["Leave"] = obj["Leave"] + 1;
      } else if (ele.status == "Off") {
        obj["Off"] = obj["Off"] + 1;
      }
    });
    return {
      success: true,
      status: 200,
      data: JSON.stringify(obj),
    };
  } catch (err) {
    console.error(err)
    return {
      status: 500,
      message: JSON.stringify(err),
      success: false,
    };
  }
};

export { fetchAttendance , fetchStatus, fetchAllAttendance,fetchAllDepAttendance};
