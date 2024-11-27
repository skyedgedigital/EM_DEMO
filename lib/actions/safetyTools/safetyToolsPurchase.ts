"use server";

import connectToDB from "@/lib/database";
import SafetyTool from "@/lib/models/safetyPanel/tools/tool.model";
import SafetyToolPurchase from "@/lib/models/safetyPanel/tools/toolPurchase.model";

const createSafetyToolPurchase = async (dataString: string) => {
  try {
    await connectToDB();
    const dataObj = JSON.parse(dataString);
    const toolId = dataObj.toolId;
    const quantity = dataObj.quantity;
    const toolDetails = await SafetyTool.findOne({
      _id: toolId,
    });
    const existingQuantity = toolDetails.quantity;
    const newQuantity = existingQuantity + quantity;
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
    const docObj = new SafetyToolPurchase({
      ...dataObj,
    });
    const result = await docObj.save();
    return {
      success: true,
      message: "SafetyToolPurchase Added",
      status: 200,
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

const deleteSafetyToolPurchase = async (purchaseId: any) => {
  try {
    await connectToDB();
    const purchaseInfo = await SafetyToolPurchase.findOne({
      _id: purchaseId,
    });
    const purchaseQuantity = purchaseInfo.quantity;
    const toolId = purchaseInfo.toolId;
    const toolDetails = await SafetyTool.findOne({
      _id: toolId,
    });
    const existingQuantity = toolDetails.quantity;
    const newQuantity = existingQuantity - purchaseQuantity;
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
    const result = await SafetyToolPurchase.deleteOne({
        _id: purchaseId,
        });
        return {
            success: true,
            message: "SafetyToolPurchase Deleted",
            status: 200,
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

const fetchSafetyToolsPurchases = async() => {
    try{
        await connectToDB();
        const result = await SafetyToolPurchase.find({}).populate("toolId");
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

export {createSafetyToolPurchase,deleteSafetyToolPurchase,fetchSafetyToolsPurchases}