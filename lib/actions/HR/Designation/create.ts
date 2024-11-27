'use server'

import connectToDB from "@/lib/database";
import Designation from "@/lib/models/HR/designation.model";

const createDesignation = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const Obj = new Designation({...dataObj})
        const resp = await Obj.save();
        return{
            success:true,
            status:200,
            data:JSON.stringify(resp),
            message:'Entry Added'
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            error:JSON.stringify(err),
            status:500
        }
    }
}

export {createDesignation}