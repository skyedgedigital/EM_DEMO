'use server'

import connectToDB from "@/lib/database";
import DepartmentHr from "@/lib/models/HR/department_hr";

const createDepartmentHr = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const Obj = new DepartmentHr({...dataObj})
        const resp = await Obj.save();
        return{
            success:true,
            status:200,
            data:JSON.stringify(resp),
            message:'Entry Added'
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            error:JSON.stringify(err),
            status:500
        }
    }
}

export {createDepartmentHr}