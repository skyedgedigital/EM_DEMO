'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";
import Engineer from "@/lib/models/engineer.model";
import mongoose from "mongoose";
import { DepartmentSchema } from "@/lib/models/department.model";


const departmentModel =
  mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

const fetchAllEngineers = async() => {
    try{
        await connectToDB();
        const result = await Engineer.find({}).populate("department", "departmentName");
        return{
            success:true,
            status:200,
            message:'List of All Engineers Fetched',
            data:JSON.stringify(result)
        }
    }
    catch(err){
        return{
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: err.message || 'Unknown error occurred'
        }
    }
}

const fetchEngineerByDepartment = async(departmentName:string) => {
    try{
        await connectToDB();
        const departmentDoc = await Department.findOne({
            departmentName:departmentName
        })
        if(!departmentDoc){
            return{
                success:false,
                status:404,
                message:`Department ${departmentName} not found`
            }
        }
        const departmentId = departmentDoc._id
        const resp = await Engineer.find({
            department:departmentId
        })
        return{
            success:true,
            status:200,
            message:`List of Engineers for the department ${departmentName}`,
            data:resp
        }
    }catch(err){
        return{
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: err.message || 'Unknown error occurred'
        }
    }
}

export {fetchAllEngineers,fetchEngineerByDepartment}