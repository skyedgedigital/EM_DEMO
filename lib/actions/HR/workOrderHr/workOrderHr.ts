'use server'

import connectToDB from "@/lib/database"
import WorkOrderHr from "@/lib/models/HR/workOrderHr.model";

const createWorkOrderHr = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const obj = new WorkOrderHr({
            ...dataObj
        })
        const resp = await obj.save();
        return{
            success:true,
            message:'Work Order Added',
            data:JSON.stringify(resp),
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status: 500,
            message:'Internal Server Error',
            error: JSON.stringify(err)
        }
    }
}

const deleteWorkOrderHr = async(id:any) => {
    try{
        await connectToDB();
        const resp = await WorkOrderHr.findByIdAndDelete(id);
        return{
            success:true,
            message:'Work Order Deleted',
            data:JSON.stringify(resp),
            status:200
        }
    }catch(err){
        return{
            success:false,
            status: 500,
            message:'Internal Server Error',
            error: JSON.stringify(err)
        }
    }
}

const fetchAllWorkOrderHr = async() => {
    try{
        await connectToDB();
        const resp = await WorkOrderHr.find();
        return{
            success:true,
            message:'Work Orders Retrieved',
            data:JSON.stringify(resp),
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status: 500,
            message:'Internal Server Error',
            error: JSON.stringify(err)
        }
    }
}

const fetchSingleWorkOrderHr = async(filter:string) => {
    try{
        await connectToDB();
        const resp = await WorkOrderHr.findOne(JSON.parse(filter))
        return{
            success:true,
            message:'Work Order Retrieved',
            data:JSON.stringify(resp),
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status: 500,
            message:'Internal Server Error',
            error: JSON.stringify(err)
        }
    }
}

const getTotalWorkOrder = async() => {
    try{
        await connectToDB();
        const resp = await WorkOrderHr.find({})
        return{
            success:true,
            status:200,
            message:'Fetched Count',
            data:resp.length
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

export {fetchAllWorkOrderHr,createWorkOrderHr,deleteWorkOrderHr,fetchSingleWorkOrderHr,getTotalWorkOrder}