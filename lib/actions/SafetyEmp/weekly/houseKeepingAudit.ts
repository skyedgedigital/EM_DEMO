"use server";

import connectToDB from "@/lib/database";
import HouseKeepingAudit from "@/lib/models/safetyPanel/emp/weekly/houseKeeping.model";

const genHkAudit = async (dataString: string) => {
  try {
    await connectToDB();
    const data = JSON.parse(dataString);
    const docObj = new HouseKeepingAudit({
      ...data,
    });
    const resp = await docObj.save();
    return {
      success: true,
      status: 200,
      message: "House Keeping Audit Created Successfully",
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "An Error Occurred",
    };
  }
};

const deleteHkAudit = async (id: any) => {
  try {
    await connectToDB();
    const resp = await HouseKeepingAudit.findByIdAndDelete(id);
    return {
      success: true,
      status: 200,
      message: "House Keeping Audit Deleted Successfully",
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "An Error Occurred",
    };
  }
};

const fetchAllHkAudit = async () => {
  try {
    await connectToDB();
    const resp = await HouseKeepingAudit.find().sort({
        createdAt:-1
    });
    return {
      success: true,
      status: 200,
      message: "House Keeping Audit Fetched Successfully",
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "An Error Occurred",
    };
  }
};

export {genHkAudit,deleteHkAudit,fetchAllHkAudit}
