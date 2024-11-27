"use server";

import connectToDB from "@/lib/database";
import PpeIssueAndReplacement from "@/lib/models/safetyPanel/ppe/ppeIssueAndReplacement.model";

const genPpeIssueAndReplacement = async (dataString: string) => {
  try {
    await connectToDB();
    const data = JSON.parse(dataString);
    const docObj = new PpeIssueAndReplacement({
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

const deletePpeIssueAndReplacement = async (id: any) => {
  try {
    await connectToDB();
    const resp = await PpeIssueAndReplacement.findByIdAndDelete(id);
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

const fetchPpeIssueAndReplacement = async () => {
  try {
    await connectToDB();
    const resp = await PpeIssueAndReplacement.find().sort({
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

export {genPpeIssueAndReplacement,deletePpeIssueAndReplacement,fetchPpeIssueAndReplacement}
