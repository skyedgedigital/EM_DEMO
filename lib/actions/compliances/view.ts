'use server'

import connectToDB from "@/lib/database";
import Compliance from "@/lib/models/compliances.model";

const fetchCompliance = async(dataObjString:string) => {
    try{
        await connectToDB();
        const searchObj = JSON.parse(dataObjString)
        const compliance = await Compliance.find(searchObj);
        return{
            success:true,
            message:'List of Compliances',
            status:200,
            data:JSON.stringify(compliance)
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal server Error',
            err:JSON.stringify(err)
        }
    }
}

export {fetchCompliance}