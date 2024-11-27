'use server'

import connectToDB from "@/lib/database"
import Vehicle from "@/lib/models/vehicle.model";

const deleteVehicleByVehicleNumber = async(vehicleNumber:string) => {
    try{
        await connectToDB();
        const findVehicle = await Vehicle.findOne({
            vehicleNumber:vehicleNumber
        })
        if(findVehicle){
            await Vehicle.findOneAndDelete({
                vehicleNumber:vehicleNumber
            })
            return {
                success:true,
                status:200,
                message:'Vehicle Data Deleted Successfully'
            }
        }
        return{
            success:false,
            status:404,
            message:'No Vehicle Found with the given Number'
        }
        
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

export {deleteVehicleByVehicleNumber}