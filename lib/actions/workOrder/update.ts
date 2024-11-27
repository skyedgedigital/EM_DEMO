'use server'

import connectToDB from "@/lib/database"
import WorkOrder from "@/lib/models/workOrder.model";

const updateWorkOrder = async(workOrderNumber:string,updatedData:any) => {
    try{
        await connectToDB();
        const filter = {
            workOrderNumber:workOrderNumber
        }
        let update = updatedData
        const ifExists = await WorkOrder.findOne({
            workOrderNumber:workOrderNumber
        })
        if(!ifExists){
            return{
                message:`The Work Order ${workOrderNumber} not exists`,
                success:false,
                status:404
            }
        }
        const result = await WorkOrder.findOneAndUpdate(filter,update,{
            new:true
        })
        return{
            success:true,
            status:201,
            message:'Successfully Updated',
            data:result
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            status:500,
            error:JSON.stringify(err)
        }
    }
}

export {updateWorkOrder}