'use server'

import connectToDB from "@/lib/database"
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

const deleteEmployeeData = async(docId:any) => {
    try{
        await connectToDB();
        const resp = await EmployeeData.findOneAndDelete({
            _id:docId
        })
        return {
            success:true,
            status:200,
            message:'Employee Data Deleted Successfully'
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

export {deleteEmployeeData}