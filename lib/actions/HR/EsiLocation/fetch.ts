'use server'

import connectToDB from "@/lib/database"
import EsiLocation from "@/lib/models/HR/EsiLocation.model";

const fetchEsiLocation = async() => {
    try{
        await connectToDB();
        const resp = await EsiLocation.find({});
        return{
            status:200,
            data:JSON.stringify(resp),
            message:'Designations fetched successfully',
            success:true
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

export {fetchEsiLocation}