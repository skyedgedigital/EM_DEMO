'use server'

import connectToDB from "@/lib/database";
import DepartmentHr from "@/lib/models/HR/department_hr";
import Designation from "@/lib/models/HR/designation.model";

const updateDepartmentHr = async(dataString:string,docId:any) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const designation = await DepartmentHr.findByIdAndUpdate(docId,data,{new:true});
        return{
            successs:true,
            status:200,
            message:'DepartmentHr Updated Successfully',
            data:JSON.stringify(designation)
        }
    }
    catch(err){
        return {
            success: false,
            message: "Internal Server Error",
            status: 500,
            error: JSON.stringify(err),
          };
    }
}

export {updateDepartmentHr}