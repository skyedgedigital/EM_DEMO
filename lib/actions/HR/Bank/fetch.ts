'use server'

import connectToDB from "@/lib/database"
import Bank from "@/lib/models/HR/bank.model";
const fetchBanks = async() => {
    try{
        await connectToDB();
        const resp = await Bank.find({});
        return{
            status:200,
            data:JSON.stringify(resp),
            message:'Banks fetched successfully'
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

export {fetchBanks}