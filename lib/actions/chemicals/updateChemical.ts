'use server'

import connectToDB from "@/lib/database"
import Chemical from "@/lib/models/safetyPanel/chemicals/chemical.model";

const updateChemical = async(chemicalId:any,updateString:string) =>{
    try{
        await connectToDB();
        const filter = {
            _id:chemicalId
        }
        const updateObj = JSON.parse(updateString);
        const updatedChemical = await Chemical.findOneAndUpdate(filter,updateObj,{
            new:true
        })
        return{
            success:true,
            message:'Tool updated successfully',
            data:updatedChemical,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            err:JSON.stringify(err),
            status:500
        }
    }
}

export {updateChemical}