'use server'

import connectToDB from "@/lib/database"
import Designation from "@/lib/models/HR/designation.model";

const fetchDesignations = async() => {
    try{
        await connectToDB();
        const resp = await Designation.find({});
        return{
            status:200,
            data:JSON.stringify(resp),
            message:'Designations fetched successfully'
            }
    }
    catch(err){
        return{
            status:500,
            err:JSON.stringify(err),
            message:'Internal Server Error'
        }
    }
}

export {fetchDesignations}