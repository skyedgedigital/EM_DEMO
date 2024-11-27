'use server'

import connectToDB from "@/lib/database"
import SafetyTool from "@/lib/models/safetyPanel/tools/tool.model";


const createTool = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString);
        const docObj = new SafetyTool({
            ...dataObj
        })
        const result = await docObj.save();
        return{
            success:true,
            status:200,
            message:'Tool Added',
            data:JSON.stringify(result)
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

const deleteTool = async(toolId:any) => {
    try{
        await connectToDB();
        const result = await SafetyTool.deleteOne({_id:toolId});
        return{
            success:true,
            status:200,
            message:'Tool Deleted'
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

const fetchSafetyTools = async() => {
    try{
        await connectToDB();
        const result = await SafetyTool.find({});
        return{
            success:true,
            status:200,
            message:'Tools Fetched',
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

const fetchSafetyToolById = async(toolId:any) => {
    try{
        await connectToDB();
        const chemicalData = await SafetyTool.findOne({
            _id:toolId
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

const updateSafetyTool = async(toolId:any,dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const result = await SafetyTool.findOneAndUpdate(
            {
                _id:toolId
            },
            {
                ...dataObj
            },{
                new:true
            }
        )
        return{
            success:true,
            status:200,
            message:'Tool Updated',
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

export {createTool,deleteTool,fetchSafetyTools,updateSafetyTool,fetchSafetyToolById}