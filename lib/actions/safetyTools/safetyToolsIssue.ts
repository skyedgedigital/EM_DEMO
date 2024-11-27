"use server";

import connectToDB from "@/lib/database";
import SafetyTool from "@/lib/models/safetyPanel/tools/tool.model";
import SafetyToolIssue from "@/lib/models/safetyPanel/tools/toolIssue.model";

const createSafetyToolIssue = async (dataString: string) => {
  try {
    await connectToDB();
    const dataObj = JSON.parse(dataString);
    console.log(dataObj)
    const toolId = dataObj.toolId;
    const quantity = dataObj.quantity;
    const toolDetails = await SafetyTool.findOne({
      _id: toolId,
    });
    const existingQuantity = toolDetails.quantity;
    const newQuantity = existingQuantity - quantity;
    const updatedSafetyTool = await SafetyTool.findOneAndUpdate(
      {
        _id: toolId,
      },
      {
        $set: {
          quantity: newQuantity,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedSafetyTool);
    const docObj = new SafetyToolIssue({
      ...dataObj,
    });
    const result = await docObj.save();
    return {
      success: true,
      status: 200,
      message: "ToolIssued Successfully",
      data: JSON.stringify(result),
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
      err: JSON.stringify(err),
    };
  }
};

const deleteSafetyToolIssue = async (toolIssueId: any) => {
  try {
    await connectToDB();
    const toolIssueDetails = await SafetyToolIssue.findOne({
      _id: toolIssueId,
    });
    const toolId = toolIssueDetails.toolId;
    const toolDetails = await SafetyTool.findOne({
      _id: toolId,
    });
    const existingQuantity = toolDetails.quantity;
    const quantityInIssue = toolIssueDetails.quantity;
    const newQuantity = existingQuantity + quantityInIssue;
    const updatedSafetyTool = await SafetyTool.findOneAndUpdate(
      {
        _id: toolId,
      },
      {
        $set: {
          quantity: newQuantity,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedSafetyTool);
    const result = await SafetyToolIssue.deleteOne({
        _id: toolIssueId,
        });
        return {
            success: true,
            status: 200,
            message: "ToolIssue Deleted Successfully",
            data: JSON.stringify(result),
            };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
      err: JSON.stringify(err),
    };
  }
};

const fetchSafetyToolsIssue = async() => {
    try{
        await connectToDB();
        const result = await SafetyToolIssue.find({}).populate("toolId").populate("issuedTo","name");
        return{
            success:true,
            status:200,
            message:'Tools Fetched',
            data:JSON.stringify(result)
            }
    }
    catch(err){
        console.log(err);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
      err: JSON.stringify(err),
    };
    }
}

export {createSafetyToolIssue,deleteSafetyToolIssue,fetchSafetyToolsIssue}