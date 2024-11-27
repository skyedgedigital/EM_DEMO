"use server";

import connectToDB from "@/lib/database";
import Chalan from "@/lib/models/chalan.model";
import { DepartmentSchema } from "@/lib/models/department.model";
import { EngineerSchema } from "@/lib/models/engineer.model";
import { ItemSchema } from "@/lib/models/item.model";
import { WorkOrderSchema } from "@/lib/models/workOrder.model";
import mongoose from "mongoose";

const workOrderModel =
  mongoose.models.WorkOrder || mongoose.model("WorkOrder", WorkOrderSchema);
const engineerModel =
  mongoose.models.Engineer || mongoose.model("Engineer", EngineerSchema);
const departmentModel =
  mongoose.models.Department || mongoose.model("Department", DepartmentSchema);
const itemModel = mongoose.models.Item || mongoose.model("Item", ItemSchema);

const getAllChalans = async (page = 1, pageSize = 10) => {
  try {
    await connectToDB();
    const skipCount = (page - 1) * pageSize;

    const docs = await Chalan.find({})
      .sort({ date: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    return {
      success: true,
      message: `All Chalans fetched for page ${page}`,
      status: 200,
      data: JSON.stringify(docs),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};




const getAllVerifiedChalans = async (page = 1, pageSize = 10) => {
  try {
    await connectToDB();
    const skipCount = (page - 1) * pageSize;

    const docs = await Chalan.find({verified:true})
      .sort({ date: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    return {
      success: true,
      message: `All Chalans fetched for page ${page}`,
      status: 200,
      data: JSON.stringify(docs),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const getAllInvoiceCreatedChalans = async (page = 1, pageSize = 10) => {
  try {
    await connectToDB();
    const skipCount = (page - 1) * pageSize;

    const docs = await Chalan.find({invoiceCreated:true})
      .sort({ date: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    return {
      success: true,
      message: `All Chalans fetched for page ${page}`,
      status: 200,
      data: JSON.stringify(docs),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const getAllNonVerifiedChalans = async (page = 1, pageSize = 10) => {
  try {
    await connectToDB();
    const skipCount = (page - 1) * pageSize;

    const docs = await Chalan.find({verified:false})
      .sort({ date: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    return {
      success: true,
      message: `All Chalans fetched for page ${page}`,
      status: 200,
      data: JSON.stringify(docs),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

type PipelineStage =
  | {
      $search: {
        index: string
        text: {
          query: string
          fuzzy: {}
          path: {
            wildcard: string
          }
        }
      }
    }
  | {
      $skip: number
    }
  | {
      $limit: number
    }



const getChalanByChalanNumber = async (chalanNumber: string) => {
  try {
    await connectToDB();
    const ifExists = await Chalan.findOne({
      chalanNumber: chalanNumber,
    });
    if (!ifExists) {
      return {
        success: false,
        status: 404,
        message: `The Chalan ${chalanNumber} does not exist`,
      };
    }
    const doc = await Chalan.findOne({
      chalanNumber: chalanNumber,
    })
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    console.log(doc);
    return {
      success: true,
      message: `Chalan ${chalanNumber} fetched`,
      status: 200,
      data: JSON.stringify(doc),
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
};

const getChalansCreatedAWeekBefore = async (page = 1, pageSize = 2) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  try {
    await connectToDB();
    const skipCount = (page - 1) * pageSize;
    const docs = await Chalan.find({ date: { $gte: sevenDaysAgo, $lte: now } })
      .sort({ date: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate("workOrder", "workOrderNumber")
      .populate("department", "departmentName")
      .populate("engineer", "name")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    return {
      success: true,
      message: `All Chalans fetched`,
      status: 200,
      data: JSON.stringify(docs),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const getChalanByEngineerAndWorkOrder = async (
  engineerId: string,
  workOrderId: string
) => {
  try {
    await connectToDB();
    let query: any = {};

    // Check if engineerName is provided
    if (engineerId) {
      query.engineer = engineerId;
    }

    // Check if workOrder is provided
    if (workOrderId) {
      query.workOrder = workOrderId;
    }
    const chalans = await Chalan.find(query).populate("workOrder", "workOrderNumber")
    .populate("department", "departmentName")
    .populate("engineer", "name")
    .populate({
      path: "items",
      populate: {
        path: "item",
        model: "Item",
      },
    });
    return {
      success: true,
      message: "Chalans fetched successfully",
      status: 200,
      data: JSON.stringify(chalans),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: JSON.stringify(err),
    };
  }
};

const getPaginationInformation = async (page = 1, pageSize = 10) => {
  try {
    await connectToDB();
    const totalChalansCount = await Chalan.countDocuments({});
    const totalPages = Math.ceil(totalChalansCount / pageSize);
    const obj = {
      totalChalansCount: totalChalansCount,
      totalPages: totalPages,
    };
    return {
      success: true,
      status: 200,
      data: JSON.stringify(obj),
    };
  } catch (err) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
      error: err.toString(),
    };
  }
};

const monthNameToNumber = (monthName: string): number => {
  const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = monthNames.indexOf(monthName);
  return monthIndex !== -1 ? monthIndex + 1 : -1; // Months are 1-based
};

const getChalansForFuelManagement = async (month: string, year: string, vehicleNumber: string) => {
  try {
      // Calculate the start and end dates for the given month and year
      const monthNum = monthNameToNumber(month);
      const yearNum = parseInt(year, 10);

      // Validate month and year
      if (monthNum === -1 || isNaN(yearNum)) {
          throw new Error('Invalid month or year');
      }

      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
console.log(startDate)
console.log(endDate)
      // Query chalans based on the date range and vehicle number in items
      console.log("fhgjhkl")
      const chalans = await Chalan.find({
        date: { $gte: startDate, $lte: endDate },
          'items.vehicleNumber': vehicleNumber,
          'items.unit': { $nin: ['fixed', 'shift'] }
      }).exec();
      console.log(chalans)
      console.log("23456789")

      const filteredChalans = [];
      let totalCost = 0;

      // Iterate over the chalans and their items to extract the required fields
      chalans.forEach(chalan => {
          chalan.items.forEach(item => {
              if (item.vehicleNumber === vehicleNumber && !['fixed', 'shift'].includes(item.unit)) {
                  filteredChalans.push({
                      chalan: chalan.chalanNumber,
                      amount: item.itemCosting,
                      //date: chalan.date,
                      hours: (item.unit === 'fixed' || item.unit === 'shift') ? 0 : item.hours
                  });
                  totalCost += item.itemCosting;
              }
          });
      });
      console.log("yeore",filteredChalans)
      return {
          success: true,
          status: 200,
          data: JSON.stringify(filteredChalans),
          total:totalCost
      };
  } catch (err) {
      console.error(err);
      return {
          success: false,
          status: 500,
          message: 'Internal Server Error',
          error: JSON.stringify(err)
      };
  }
};

export {
  getAllChalans,
  getChalanByChalanNumber,
  getChalansCreatedAWeekBefore,
  getPaginationInformation,
  getChalanByEngineerAndWorkOrder,
  getAllVerifiedChalans,
  getAllNonVerifiedChalans,
  getAllInvoiceCreatedChalans,
  getChalansForFuelManagement
};
