'use server'

import connectToDB from "@/lib/database"
import Chalan from "@/lib/models/chalan.model";

const deleteChalanbyChalanNumber = async(chalanNumber:string) => {
    try{
        await connectToDB();
        const ifExists = await Chalan.findOne({
            chalanNumber:chalanNumber
        })
        if(!ifExists){
            return{
                success:false,
                status:404,
                message:`The Chalan ${chalanNumber} not exists`
            }
        }
        await Chalan.findOneAndDelete({
            chalanNumber:chalanNumber
        })
        return{
            success:true,
            message:`Chalan ${chalanNumber} deleted`,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            status:500,
            error:JSON.stringify(err)
        }
    }
}

export {deleteChalanbyChalanNumber}