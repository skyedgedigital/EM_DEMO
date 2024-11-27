'use server'

import connectToDB from "@/lib/database"
import Tool from "@/lib/models/tool.model";

const fetchTools = async() => {
    try{
        await connectToDB();
        const tools = await Tool.find({})

        return{
            success:true,
            message:'Tools Fetched',
            status:200,
            data:JSON.stringify(tools)
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            err:JSON.stringify(err),
        }
    }
}

export {fetchTools}