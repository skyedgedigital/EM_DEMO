'use server'

import connectToDB from "@/lib/database"
import PpeChecking from "@/lib/models/safetyPanel/emp/dailyTask.tsx/ppeChecking.model";

const addPpeChecking = async(dataString:string) => {
    try{
        await connectToDB();
        const docObj = new PpeChecking(JSON.parse(dataString))
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

const deletePpeChecking = async(id:any) => {
    try{
        await connectToDB();
        const resp = await PpeChecking.deleteOne({_id:id});
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

const updatePpeChecking = async(id:any,dataString:string) => {
    try{
        await connectToDB();
        const docObj = new PpeChecking(JSON.parse(dataString))
        const resp = await PpeChecking.findOneAndUpdate({
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

const fetchPpeCheckingAll = async() => {
    try{
        await connectToDB();
        const resp = await PpeChecking.find({}).sort({createdAt:-1});
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

const fetchPpeCheckingById = async(id:any) => {
    try{
        await connectToDB();
        const resp = await PpeChecking.findOne({_id:id});
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

export {addPpeChecking,deletePpeChecking,updatePpeChecking,fetchPpeCheckingAll,fetchPpeCheckingById}