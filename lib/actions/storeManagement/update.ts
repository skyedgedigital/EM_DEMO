'use server'

import connectToDB from "@/lib/database";
import Store from "@/lib/models/storeManagement.model";
import Tool from "@/lib/models/tool.model";

const updateStoreManagment = async(toolId:any,updatesObjString:string) => {
    try {
        await connectToDB();
        let updatesObj = JSON.parse(updatesObjString)
        let resp = await Store.findOneAndUpdate({_id:toolId},updatesObj,{
            new:true
        })
    
        return {
          success: true,
          status: 200,
          message: "Consumable saved",
          data: JSON.stringify(resp),
        };
      } catch (err) {
        return {
          err: JSON.stringify(err),
          success: false,
          status: 500,
          message: "Error saving consumable",
        };
      }
}

const returnTool = async(storeManagementId:any) => {
  try{
    await connectToDB();
    const storeUpdation = await Store.findOneAndUpdate({
      _id:storeManagementId
    },{
      returned:true
    },{
      new:true
    })
    const toolId = storeUpdation.tool;
    const quantity = storeUpdation.quantity;
    const toolQuantityUpdation = await Tool.findOneAndUpdate({
      _id:toolId
    },
    {
      $inc:{
        quantity:quantity
      }
    },
    {
      new:true
    }
    )
    return{
      success:true,
      status:200,
      message:'Tool Returned and Storage updated',
      data:JSON.stringify(toolQuantityUpdation)
    }
  }
  catch(err){
    return {
      err: JSON.stringify(err),
      success: false,
      status: 500,
      message: "Error saving consumable",
    };
  }
}

export {updateStoreManagment,returnTool}