'use server'

import connectToDB from "@/lib/database"
import Department from "@/lib/models/department.model";

const fetchAllDepartments = async() => {
    try{
        await connectToDB();
        const result = await Department.find({});
        return{
            success:true,
            status:200,
            message:'List of All Departments',
            data:result
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

export {fetchAllDepartments}