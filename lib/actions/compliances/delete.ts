'use server'

import connectToDB from "@/lib/database"
import Compliance from "@/lib/models/compliances.model";

const deleteCompliance = async(complianceId:any) => {
    try{
        await connectToDB();
        const compliance = await Compliance.findByIdAndDelete(complianceId);
        if(!compliance){
            return{
                success:false,
                status:404,
                message:'Compliance not found'
            }
        }
        return{
            success:true,
            status:200,
            message:'Compliance Deleted',
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

export {deleteCompliance}