"use server";

import connectToDB from "@/lib/database";
import SafetyIndAndTraining from "@/lib/models/safetyPanel/emp/weekly/safetyIndAndTraining.model";

const genSafetyIndAndTraining = async (dataString: string) => {
  try {
    await connectToDB();
    const data = JSON.parse(dataString);
    const docObj = new SafetyIndAndTraining({
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

const deleteSafetyIndAndTraining = async (id: any) => {
  try {
    await connectToDB();
    const resp = await SafetyIndAndTraining.findByIdAndDelete(id);
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

const fetchSafetyIndAndTraining = async () => {
  try {
    await connectToDB();
    const resp = await SafetyIndAndTraining.find().sort({
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

export {genSafetyIndAndTraining,deleteSafetyIndAndTraining,fetchSafetyIndAndTraining}
