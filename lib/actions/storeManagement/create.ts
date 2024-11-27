'use server'

import connectToDB from "@/lib/database";
import Store from "@/lib/models/storeManagement.model";
import Tool from "@/lib/models/tool.model";

const createStoreManagment = async(dataString:string) => {
    try {
        await connectToDB();
        let dataObj = JSON.parse(dataString);
        const toolName = dataObj.tool;

        const toolDoc = await Tool.findOne({
          toolName:toolName
        })

        if(!toolDoc){
          return{
            success:false,
            status:404,
            message:'Tool Not Found'
          }
        }

        const availableQuantity = toolDoc.quantity;

        if( dataObj.quantity > availableQuantity ){
          return{
            success:false,
            status:400,
            message:'Not Enough Quantity'
          }
        }

        dataObj.tool = toolDoc._id
        dataObj.totalPrice = toolDoc.price * dataObj.quantity

        const allottedToolDoc = new Store({
          ...dataObj
        })

        const resp = await allottedToolDoc.save()

        if(resp){
          await Tool.findOneAndUpdate({
            toolName:toolName
          },{
            quantity:availableQuantity - dataObj.quantity
          },{
            new:true
          })
        }
    
        return {
          success: true,
          status: 200,
          message: "Tool Allotted",
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

export {createStoreManagment}