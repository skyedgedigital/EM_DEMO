'use server'

import connectToDB from "@/lib/database"
import Tool from "@/lib/models/tool.model";

const createTool = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString)
        const Obj = new Tool({
            ...dataObj
        })
        const result = await Obj.save()
        return{
            success:true,
            message:'Tool Added to Inventory',
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

export {createTool}