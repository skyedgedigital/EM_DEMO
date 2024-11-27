'use server'

import connectToDB from "@/lib/database";
import Bank from "@/lib/models/HR/bank.model";
import { revalidatePath } from "next/cache";
const createBank = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const Obj = new Bank({...dataObj})
        const resp = await Obj.save();
        revalidatePath('/hr/bank')
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

export {createBank}