'use server'

import connectToDB from "@/lib/database";
import DepartmentHr from "@/lib/models/HR/department_hr";

const deleteDepartmentHr = async(docId:any) => {
    try{
        await connectToDB();
        const resp = await DepartmentHr.findOneAndDelete({
            _id:docId
        })
        if(resp){
            return {
                success:true,
                status:200,
                message:'Deleted Successfully',
                data:resp
            }
        }
        else{
            return{
                success:false,
                status:404,
                message:'Fuel Management Not Found',
                data:null
            }
        }
    }
    catch(err){
        return {
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export {deleteDepartmentHr}