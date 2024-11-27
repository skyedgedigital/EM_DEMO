'use server'

import connectToDB from "@/lib/database"
import DepartmentHr from "@/lib/models/HR/department_hr";

const fetchDepartmentHr = async() => {
    try{
        await connectToDB();
        const resp = await DepartmentHr.find({});
        return{
            status:200,
            data:JSON.stringify(resp),
            message:'DepartmentsHr fetched successfully',
            success:true
            }
    }
    catch(err){
        return{
            status:500,
            err:JSON.stringify(err),
            message:'Internal Server Error',
            success:false
        }
    }
}

export {fetchDepartmentHr}