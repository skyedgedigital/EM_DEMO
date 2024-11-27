'use server'

import connectToDB from "@/lib/database"
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

const autoGenEmpCode = async() => {
    try{
        await connectToDB();
        const listOfEmps = await EmployeeData.find({})
        let maxVal = 1;
        listOfEmps.forEach(element => {
            let tmp:number = Number(element.code)
            if(tmp > maxVal){
                maxVal = tmp;
            }
        });
        return{
            success:true,
            status:200,
            data:maxVal+1
        }
    }
    catch(err){
        return{
            status:500,
            success:false,
            message:'Internal Server Error'
        }
    }
}

export {autoGenEmpCode}