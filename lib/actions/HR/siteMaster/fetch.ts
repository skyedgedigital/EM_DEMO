'use server'

import connectToDB from "@/lib/database";
import Site from "@/lib/models/HR/siteMaster.model";

const fetchSiteMaster = async() => {
    try{
        await connectToDB();
        const siteMaster = await Site.find({});

        return{
            success: true,
            message: "Site Master Fetched Successfully",
            status: 200,
            data:JSON.stringify(siteMaster)
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

export {fetchSiteMaster}