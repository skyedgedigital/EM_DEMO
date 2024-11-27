'use server'

import connectToDB from "@/lib/database";
import Bank from "@/lib/models/HR/bank.model";
import { revalidatePath } from "next/cache";

const updateBank = async(dataString:string,docId:any) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const bank = await Bank.findByIdAndUpdate(docId,data,{new:true});
        revalidatePath('/hr/bank')
        return{
            successs:true,
            status:200,
            message:'Bank Updated Successfully',
            data:JSON.stringify(bank)
        }
    }
    catch(err){
        return {
            success: false,
            message: "Internal Server Error",
            status: 500,
            error: JSON.stringify(err),
          };
    }
}

export {updateBank}