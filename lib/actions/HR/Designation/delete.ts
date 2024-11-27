'use server'

import connectToDB from "@/lib/database";
import Designation from "@/lib/models/HR/designation.model";

const deleteDesignation = async(docId:any) => {
    try{
        await connectToDB();
        const resp = await Designation.findOneAndDelete({
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

export {deleteDesignation}