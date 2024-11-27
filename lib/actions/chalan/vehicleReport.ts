"use server";

import connectToDB from "@/lib/database";
import Chalan from "@/lib/models/chalan.model";
import { DepartmentSchema } from "@/lib/models/department.model";
import { EngineerSchema } from "@/lib/models/engineer.model";
import Item from "@/lib/models/item.model";
import mongoose from "mongoose";

const EngineerModel = mongoose.models.Engineer || mongoose.model("Engineer", EngineerSchema);
const DepartmentModel = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

let itemsIdMap = new Map();

const initializeValueInMap = async () => {
  try {
    await connectToDB();
    const allItems = await Item.find({});
    allItems.forEach((item) => {
      // Use ObjectId as the key if required
      itemsIdMap.set(item._id.toString(), item.itemName);
    });
    console.log(itemsIdMap);
    return {
      success: true,
      status: 200,
      message: "Map Initialized",
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "Error",
    };
  }
};

const vehicleReport = async (startDate, endDate) => {
  try {
    await connectToDB();
    await initializeValueInMap();
    console.log(startDate);
    console.log(endDate);

    const [startDay, startMonth, startYear] = startDate.split("-").map(Number);
    const [endDay, endMonth, endYear] = endDate.split("-").map(Number);
    const start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);
    const end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59);

    const vehicleReports = await Chalan.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).populate('engineer','name').populate('department','departmentName');

    let arr = [];
    let totalAmount:number = 0;
    let totalGst:number = 0;

    vehicleReports.map((ele) => {
      var itemsList = ele.items;
      itemsList.map((item) => {
        let itemName = "";
        itemName = itemsIdMap.get(item.item.toString());
        console.log(itemName);
        console.log(item);

        arr.push({
          chalanId: ele._id,
          chalanNumber: ele.chalanNumber,
          date: ele.date,
          item: itemName,
          vehicleNumber: item.vehicleNumber,
          hours: item.hours,
          gst: (item.itemCosting * 0.18).toFixed(2),
          total: (item.itemCosting * 1.18).toFixed(2),
          location:ele.location,
          department:ele.department,
          engineer:ele.engineer,
          amount:item.itemCosting.toFixed(2)
        });
        totalAmount += item.itemCosting;
        totalGst += (item.itemCosting * 0.18);
      });
    });

    return {
      success: true,
      data: JSON.stringify(arr),
      total:{
        totalAmount:(totalAmount).toFixed(2),
        totalGst:totalGst.toFixed(2),
        total:(totalAmount+totalGst).toFixed(2)
      },
      message: "Vehicle reports fetched successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message,
      status: 500,
    };
  }
};

export { vehicleReport };
