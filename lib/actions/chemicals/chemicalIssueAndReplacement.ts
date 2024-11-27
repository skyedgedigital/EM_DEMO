'use server'

import connectToDB from "@/lib/database"
import ChemicalIssueAndReplacementRegister from "@/lib/models/safetyPanel/chemicals/chemicalssueAndReplacementRegister.model";

const genChemicalIssueAndReplacement = async(dataString:string) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const dataObj = new ChemicalIssueAndReplacementRegister({
            ...data
        })
        const resp = await dataObj.save();
        return{
            success:true,
            message:'Register Created',
            data:JSON.stringify(resp),
            status:200
        }
    }
    catch(err){
        return{
            status: 500,
            success:false,
            message:'Internal Server Error'
        }
    }
}

const viewChemicalIssueAndReplacementRegister = async() => {
    try{
        await connectToDB();
        const resp = await ChemicalIssueAndReplacementRegister.find({})
        return{
            data:JSON.stringify(resp),
            success:true,
            status:200,
            messgae:'Fetched Succesfully'
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

const deleteChemicalIssueAndReplacementRegister = async(id:any) => {
    try{
        await connectToDB();
        const resp = await ChemicalIssueAndReplacementRegister.findByIdAndDelete(id);
        return{
            success:true,
            message:'Deleted',
            data:JSON.stringify(resp),
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:"Internal Server Error",
            err:JSON.stringify(err)
        }
    }
}

export {genChemicalIssueAndReplacement,viewChemicalIssueAndReplacementRegister,deleteChemicalIssueAndReplacementRegister}