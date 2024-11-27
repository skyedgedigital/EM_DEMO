'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";
import Engineer from "@/lib/models/engineer.model";
import { revalidatePath } from "next/cache";
const deleteEngineer = async(engineerName:string,departmentName:string) => {
    try{
        await connectToDB();
        const DepartmentDoc = await Department.findOne({
            departmentName:departmentName
        })
        if(!DepartmentDoc){
            return{
                success:false,
                status:404,
                message:`Department ${departmentName} not Found`
            }
        }
        const departmentId = DepartmentDoc._id
        await Engineer.findOneAndDelete({
            name:engineerName,
            department:departmentId
        })
        revalidatePath('/admin/engineers')

        return{
            success:true,
            status:201,
            message:`Engineer ${engineerName} associated with ${departmentName} deleted`
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

export {deleteEngineer}