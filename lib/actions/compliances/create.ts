'use server'

import connectToDB from "@/lib/database"
import Compliance from "@/lib/models/compliances.model";

const createCompliance = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString);
        const docObj = new Compliance({
            ...dataObj
        })
        const result = await docObj.save();
        return{
            success:true,
            message:'Compliance Added',
            status:200,
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

export {createCompliance}