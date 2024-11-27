'use server'

import connectToDB from "@/lib/database"
import FuelManagement from "@/lib/models/fuelManagement.model";

const deleteFuelManagement = async(docId:any) => {
    console.log("The Doc Id",docId)
    try{
        await connectToDB();
        const resp = await FuelManagement.findOneAndDelete({
            _id:docId
        })
        if(resp){
            return {
                success:true,
                status:200,
                message:'Deleted Successfully',
                data:resp
            }
        }
        else{
            return{
                success:false,
                status:404,
                message:'Fuel Management Not Found',
                data:null
            }
        }
    }
    catch(err){
        return {
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export {deleteFuelManagement}