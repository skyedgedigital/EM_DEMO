'use server'

import connectToDB from "@/lib/database"
import Chemical from "@/lib/models/safetyPanel/chemicals/chemical.model";

const fetchChemicals = async() => {
    try{
        await connectToDB();
        const chemicals = await Chemical.find({});
        return{
            success:true,
            status:200,
            message:'List of All Chemicals',
            data:JSON.stringify(chemicals)
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

const fetchChemicalById = async(chemicalId:any) => {
    try{
        await connectToDB();
        const chemicalData = await Chemical.findOne({
            _id:chemicalId
        })
        return{
            success:true,
            status:200,
            message:'Details of the chemical',
            data:JSON.stringify(chemicalData)
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

export {fetchChemicalById,fetchChemicals};