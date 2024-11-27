'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";



const createDepartment = async(departmentName:any) => {
    try{
       await connectToDB();
       const ifExists = await Department.findOne({
        departmentName:departmentName
       })
       console.log(ifExists)
       if(ifExists){
        return{
            success:false,
            message:`Department ${departmentName} already Exists`,
            status:400,
        }
       }
       const obj = new Department({
        departmentName:departmentName
       })
       const result = await obj.save();
       return{
        success:true,
        status:200,
        message:`Department ${departmentName} added`,
        data:result
       }
    }
    catch(err){
        return{
            success:true,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

export {createDepartment}