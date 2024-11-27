'use server'

import connectToDB from "@/lib/database"
import Item from "@/lib/models/item.model";
import WorkOrder from "@/lib/models/workOrder.model";
import mongoose from "mongoose";

const fetchAllItemsOfWorkOrder = async(workOrderNumber) => {
    try{
        console.log("wowow")
        const filter=await JSON.parse(workOrderNumber)
        const find=filter.toString()
        await connectToDB();
        console.log(workOrderNumber)
        console.log(typeof(filter))
        const getWorkOrder = await WorkOrder.findOne({
            workOrderNumber: find
        })
       
        const WorkOrderId = getWorkOrder._id
        const result = await Item.find({
            workOrder:WorkOrderId
        })
        console.log("okay boss")
        console.log(result)
        return{
            success:true,
            status:200,
            message:`Fetched Data of all Items from WorkOrder ${workOrderNumber}`,
            data:JSON.stringify(result)
        }
    }catch(err){
        console.log(err)
        
        return{
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: err.message || 'Unknown error occurred'
        }
    }
}

const fetchItemByItemNumber = async(itemNumber:number) => {
    try{
        await connectToDB();
        const resp = await Item.findOne({
            itemNumber:itemNumber,
        })
        if(!resp){
            return{
                success:false,
                status:404,
                message:`Item With Number ${itemNumber} not found`
            }
        }
        return{
            success:true,
            status:200,
            message:`Item Fetched with ItemNumber ${itemNumber}`,
            data:resp
        }
    }
    catch(err){
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: err.message || 'Unknown error occurred'
        };
    }
}

const fetchItemByItemId = async(itemNumber:string) => {
    try{
        await connectToDB();
        const resp = await Item.findById({
          _id: itemNumber
        })
        if(!resp){
            return{
                success:false,
                status:404,
                message:`Item With Number ${itemNumber} not found`
            }
        }
        return{
            success:true,
            status:200,
            message:`Item Fetched with ItemNumber ${itemNumber}`,
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: err.message || 'Unknown error occurred'
        };
    }
}

const fetchHsnNumberByItemId = async(itemId:string) => {
    try{
        await connectToDB();
        const resp = await Item.findOne({
            _id: itemId
        })
        return{
            success:true,
            status:200,
            message:`Hsn Number Fetched with ItemNumber ${itemId}`,
            data:resp.hsnNo
        }
    }
    catch(err){
        return{
            success: false,
            status: 500,
            
        }
    }
}

export {fetchAllItemsOfWorkOrder,fetchItemByItemNumber,fetchItemByItemId,fetchHsnNumberByItemId}