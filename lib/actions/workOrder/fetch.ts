'use server'

import connectToDB from "@/lib/database"
import WorkOrder from "@/lib/models/workOrder.model";

const fetchAllWorkOrdersData = async() => {
    try{
        await connectToDB();
        const resp = await WorkOrder.find({});
        return{
            success:true,
            status:200,
            message:'List of All Work Order Fetched',
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

const fetchWorkOrderByWorkOrderNumber = async(workOrderNumber:string) => {
    try{
        await connectToDB();
        const findWorkOrderExists = await WorkOrder.findOne({
            workOrderNumber:workOrderNumber
        });
        if(!findWorkOrderExists){
            return{
                success:false,
                status:404,
                message:'No WorkOrder With This Number Exists'
            }
        }
        const resp = await WorkOrder.findOne({
            workOrderNumber:workOrderNumber
        })
        return {
            success:true,
            status:200,
            message:`Data of WorkOrder ${workOrderNumber}`,
            data:resp
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}


const fetchWorkOrderByWorkOrderId = async(workOrderNumber:string) => {
    try{
        await connectToDB();
        console.log(workOrderNumber)
        const findWorkOrderExists = await WorkOrder.findById({
        _id:workOrderNumber
        });
        if(!findWorkOrderExists){
            return{
                success:false,
                status:404,
                message:'No WorkOrder With This Number Exists'
            }
        }
        const resp = await WorkOrder.findOne({
            _id:workOrderNumber
        })
        return {
            success:true,
            status:200,
            message:`Data of WorkOrder ${workOrderNumber}`,
            data:resp
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

const fetchWorkOrderUnitsByWorkOrderNameOrId = async(filter:string) => {
    try{
        await connectToDB();
        const findIfWorkOrderExists = await WorkOrder.findOne(JSON.parse(filter))
        if(!findIfWorkOrderExists){
            return{
                success:false,
                status:404,
                message:'WorkOrder not Found'
            }
        }
        const units = findIfWorkOrderExists.units;
        return{
            success:true,
            status:200,
            message:'Units Fetched',
            data:JSON.stringify(units)
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

export {fetchAllWorkOrdersData,fetchWorkOrderByWorkOrderNumber, fetchWorkOrderByWorkOrderId,fetchWorkOrderUnitsByWorkOrderNameOrId}