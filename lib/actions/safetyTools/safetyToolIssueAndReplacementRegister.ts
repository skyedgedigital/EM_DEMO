'use server'

import connectToDB from "@/lib/database"
import ToolIssueAndReplacementRegister from "@/lib/models/safetyPanel/tools/toolIssueAndReplacement.model";

const genSafetyToolIssueAndReplacement = async(dataString:string) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const dataObj = new ToolIssueAndReplacementRegister({
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

const viewSafetyToolIssueAndReplacement = async() => {
    try{
        await connectToDB();
        const resp = await ToolIssueAndReplacementRegister.find({})
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

const deleteSafetyToolIssueAndReplacement = async(id:any) => {
    try{
        await connectToDB();
        const resp = await ToolIssueAndReplacementRegister.findByIdAndDelete(id);
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

export {genSafetyToolIssueAndReplacement,viewSafetyToolIssueAndReplacement,deleteSafetyToolIssueAndReplacement}