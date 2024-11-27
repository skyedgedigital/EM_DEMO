'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";
import { revalidatePath } from "next/cache";

const deleteDepartment = async(departmentName:string) => {
    try{
        await connectToDB();
        const ifExists = await Department.findOne({
            departmentName:departmentName
        })
        if(!ifExists){
            return{
                success:false,
                status:404,
                message:'Department Name not Found'
            }
        }
        await Department.findOneAndDelete({
            departmentName:departmentName
        })
        revalidatePath('/admin/drivers')

        return{
            success:true,
            message:`Department ${departmentName} deleted`,
            status:201
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
export {deleteDepartment}