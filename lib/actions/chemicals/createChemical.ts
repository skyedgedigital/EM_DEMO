'use server'

import connectToDB from "@/lib/database"
import Chemical from "@/lib/models/safetyPanel/chemicals/chemical.model";

const createChemical = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString);
        const docObj = new Chemical({
            ...dataObj
        })
        const result = await docObj.save();
        return{
            success:true,
            message:'Chemical Added',
            status:200,
            data:JSON.stringify(result)
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export default createChemical