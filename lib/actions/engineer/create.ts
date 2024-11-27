'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";
import Engineer from "@/lib/models/engineer.model";
import { revalidatePath } from "next/cache";
const createEngineer = async(engineerName:string,departmentName:string) => {
    try{
        await connectToDB();
        const departmentExists = await Department.findOne({
            departmentName:departmentName
        })
        if(!departmentExists){
            return{
                success:false,
                status:404,
                message:`Department with name ${departmentName} not found`
            }
        }
        const departmentId = departmentExists._id
        const ifEngineerExists = await Engineer.findOne({
            department:departmentId,
            name:engineerName
        })
        if(ifEngineerExists){
            return{
                success:false,
                status:400,
                message:`Engineer ${engineerName} already associated with ${departmentName}`
            }
        }
        const obj = new Engineer({
            name:engineerName,
            department:departmentId
        })
        const resp = await obj.save();
        revalidatePath('/admin/engineers')
        return{
            success:true,
            message:`Engineer ${engineerName} added for department ${departmentName}`,
            status:201,
            data:resp
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

export {createEngineer}