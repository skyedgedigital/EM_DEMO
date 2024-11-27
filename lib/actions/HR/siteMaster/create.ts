'use server'

import connectToDB from "@/lib/database";
import Site from "@/lib/models/HR/siteMaster.model";

const createSiteMaster = async(dataString:string) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const Obj = new Site({
            ...data
        })
        const resp = await Obj.save()
        return{
            success: true,
            message: "Site Created Successfully",
            status: 200,
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        return {
            success: false,
            message: "Internal Server Error",
            status: 500,
            error: JSON.stringify(err),
        };
    }
}

export {createSiteMaster}