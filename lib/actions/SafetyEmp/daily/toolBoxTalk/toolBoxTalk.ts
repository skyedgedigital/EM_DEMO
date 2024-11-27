'use server'

import connectToDB from "@/lib/database"
import ToolBoxTalk from "@/lib/models/safetyPanel/toolBoxTalk/toolBoxTalk.model";

const genToolBoxTalk = async(dataString:string) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const docObj = new ToolBoxTalk({
            ...data
        })
        const resp = await docObj.save();
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk created successfully",
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

const deleteToolBoxTalk = async(id:any) => {
    try{
        await connectToDB();
        const resp = await ToolBoxTalk.findByIdAndDelete(id);
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk deleted successfully",
            status:200
            }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

const fetchAllToolBoxTalk = async() => {
    try{
        await connectToDB();
        const resp = await ToolBoxTalk.find({});
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk fetched successfully",
            status:200
            }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

export {deleteToolBoxTalk,genToolBoxTalk,fetchAllToolBoxTalk}