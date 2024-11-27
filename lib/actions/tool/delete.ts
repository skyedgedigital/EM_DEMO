'use server'

import connectToDB from "@/lib/database"
import Tool from "@/lib/models/tool.model";

const deleteTool = async(toolId:any) => {
    try{
        await connectToDB();
        const resp = await Tool.findByIdAndDelete(toolId);
        if(resp){
            return{
                success:true,
                message:'Tool Deleted Successfully',
                status:200
            }
        }
        else{
            return{
                success:false,
                message:'Tool not Found',
                status:404
            }
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

export {deleteTool}