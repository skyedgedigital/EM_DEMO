'use server'

import connectToDB from "@/lib/database";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

const updateEmployeeData = async(dataString:string,docId:any) => {
    try{
        await connectToDB();
        console.log(docId)
        const updatedData = JSON.parse(dataString)
        const resp = await EmployeeData.findOneAndUpdate(
            {
                _id:docId
            },
            {
                $set:updatedData
            },
            {
                new:true
            }
        )
        return{
            success: true,
            message: "Employee Data Updated Successfully",
            status: 200,
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

export {updateEmployeeData}