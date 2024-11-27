'use server'

import connectToDB from "@/lib/database";
import Ppe from "@/lib/models/safetyPanel/ppe/ppe.model";
import PpePurchase from "@/lib/models/safetyPanel/ppe/ppePurchase.model";

const createPpePurchase = async (dataString: string) => {
    try {
      await connectToDB();
      const dataObj = JSON.parse(dataString);
      const toolId = dataObj.ppeId;
      const quantity = dataObj.quantity;
      const toolDetails = await Ppe.findOne({
        _id: toolId,
      });
      const existingQuantity = toolDetails.quantity;
      const newQuantity = existingQuantity + quantity;
      const updatedSafetyTool = await Ppe.findOneAndUpdate(
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
      const docObj = new PpePurchase({
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
  
  const deletePpePurchase = async (purchaseId: any) => {
    try {
      await connectToDB();
      const purchaseInfo = await PpePurchase.findOne({
        _id: purchaseId,
      });
      const purchaseQuantity = purchaseInfo.quantity;
      const toolId = purchaseInfo.ppeId;
      const toolDetails = await Ppe.findOne({
        _id: toolId,
      });
      const existingQuantity = toolDetails.quantity;
      const newQuantity = existingQuantity - purchaseQuantity;
      const updatedSafetyTool = await Ppe.findOneAndUpdate(
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
      const result = await PpePurchase.deleteOne({
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
  
  const fetchPpePurchases = async() => {
      try{
          await connectToDB();
          const result = await PpePurchase.find({}).populate("ppeId");
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

export {createPpePurchase,deletePpePurchase,fetchPpePurchases}