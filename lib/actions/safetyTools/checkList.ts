'use server'

import connectToDB from "@/lib/database";
import ToolCheckList from "@/lib/models/safetyPanel/tools/toolCheckList.model";


const genCheckList = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const Obj = new ToolCheckList({
            ...dataObj
        })
        const result = await Obj.save()
        return{
            success:true,
            message:'Check List Added',
            status:200,
            data:JSON.stringify(result)
        }
    }
    catch(err){
        return{
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err),
            success:false
        }
    }
}

const getCheckListAll = async() => {
    try{
        await connectToDB();
        const result = await ToolCheckList.find({});
        return{
            success:true,
            status:200,
            message:'CheckList Fetched',
            data:JSON.stringify(result)
            }
    }
    catch(err){
        console.log(err);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
      err: JSON.stringify(err),
    };
    }
}

const deleteCheckListById = async(ppeId:any) => {
    try{
        await connectToDB();
        const result = await ToolCheckList.deleteOne({_id:ppeId});
        return{
            success:true,
            status:200,
            message:'CheckList Deleted'
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

export {genCheckList,getCheckListAll,deleteCheckListById}