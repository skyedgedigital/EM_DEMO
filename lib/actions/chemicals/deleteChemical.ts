'use server'

import connectToDB from "@/lib/database";
import Chemical from "@/lib/models/safetyPanel/chemicals/chemical.model";

const deleteChemical = async(chemicalId:any) => {
    try{
        await connectToDB();
        const result = await Chemical.deleteOne({_id:chemicalId});
        return{
            success:true,
            message:'Chemical Deleted',
            status:200,
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export default deleteChemical