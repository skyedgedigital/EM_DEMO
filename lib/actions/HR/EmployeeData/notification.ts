'use server'

import connectToDB from "@/lib/database"
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

const parseDate = (dateStr:string):Date => {
    const [day,month,year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

const getNotification = async() => {
    try{
        await connectToDB();
        const empDateMap = new Map<string,Date>();
        const emps = await EmployeeData.find({})
        let arr = []
        const today = new Date();
        const daysLimit = 60*24*60*60*1000
        emps.forEach(element => {
            let parsedDate = parseDate(element.gatePassValidTill)
            if(parsedDate>=today && parsedDate.getTime()<=today.getTime()+daysLimit){
                arr.push({
                    empId:element._id,
                    empName:element.name,
                    empCode:element.code,
                    gatePassValidTill:element.gatePassValidTill
                })
            }
        });
        console.log(arr)
        return{
            success:true,
            data:JSON.stringify(arr),
            status:200,
            totalCount:arr.length
        }
    }
    catch(err){
        return{
            success:false,
            message:err.message,
            status:500
        }
    }
}

export {getNotification}