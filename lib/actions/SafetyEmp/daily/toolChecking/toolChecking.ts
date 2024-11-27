'use server'

import connectToDB from "@/lib/database";
import ToolChecking from "@/lib/models/safetyPanel/emp/dailyTask.tsx/toolChecking.model";

const addToolChecking = async(dataString:string) => {
    try{
        await connectToDB();
        const docObj = new ToolChecking(JSON.parse(dataString))
        const resp = await docObj.save();
        return{
            success:true,
            status:200,
            message:'Ppe Checking Saved',
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

const deleteToolChecking = async(id:any) => {
    try{
        await connectToDB();
        const resp = await ToolChecking.deleteOne({_id:id});
        return{
            success:true,
            status:200,
            message:'Ppe Checking Deleted',
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

const updateToolChecking = async(id:any,dataString:string) => {
    try{
        await connectToDB();
        const docObj = new ToolChecking(JSON.parse(dataString))
        const resp = await ToolChecking.findOneAndUpdate({
            _id:id
        },
        {
            $set:docObj
        },
        {
            new:true
        }
        )
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

const fetchToolCheckingAll = async() => {
    try{
        await connectToDB();
        const resp = await ToolChecking.find({}).sort({createdAt:-1});
        return{
            success:true,
            status:200,
            message:"Ppe Checkings Fetched",
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

const fetchToolCheckingById = async(id:any) => {
    try{
        await connectToDB();
        const resp = await ToolChecking.findOne({_id:id});
        return{
            success:true,
            status:200,
            message:"Ppe Checkings Fetched",
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        console.error(err)
        return{
            success:false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

export {addToolChecking,deleteToolChecking,updateToolChecking,fetchToolCheckingAll,fetchToolCheckingById}