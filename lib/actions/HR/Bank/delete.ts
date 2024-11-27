'use server'

import connectToDB from "@/lib/database";
import Bank from "@/lib/models/HR/bank.model";
import { revalidatePath } from "next/cache";


const deleteBank = async(docId:any) => {
    try{
        await connectToDB();
        const resp = await Bank.findOneAndDelete({
            _id:docId
        })
        if(resp){
            revalidatePath('/hr/bank')
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

export {deleteBank}