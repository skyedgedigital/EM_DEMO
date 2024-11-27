'use server'

import connectToDB from "@/lib/database"
import DailyUtilisation from "@/lib/models/dailyUtilisation.model";

const createDailyUtilisation = async(data:string) => {
    try{
        await connectToDB();
        const obj = new DailyUtilisation(JSON.parse(data))
        const resp = await obj.save();
        return{
            success:true,
            status:200,
            message:"Daily Utilisation created successfully",
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Error creating Daily Utilisation",
            data:JSON.stringify(err)
        }
    }
}

export default createDailyUtilisation