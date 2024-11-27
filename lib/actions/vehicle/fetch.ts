'use server'

import connectToDB from "@/lib/database";
import Vehicle from "@/lib/models/vehicle.model"

const fetchAllVehicles = async() => {
    try{
        await connectToDB();
        const vehicles = await Vehicle.find();
        return {
            success:true,
            status:200,
            message:'Successfully Fetched List of Vehicles',
            data:vehicles
        }
    }
    catch(err){
        return {
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

const fetchVehicleByVehicleNumber = async(vehicleNumber:string) => {
    try{
        await connectToDB();
        const resp = await Vehicle.findOne({
            vehicleNumber:vehicleNumber
        })
        if(resp){
            return{
                success:true,
                status:200,
                message:'Vehicle Found',
                data:resp
            }
        }
        return {
            success:false,
            status:404,
            message:'Vehicle Not Found'
        }
    }
    catch(err){
        return {
            success:false,
            status:500,
            message:'Internal Server Error',
            error:JSON.stringify(err)
        }
    }
}

export {fetchAllVehicles,fetchVehicleByVehicleNumber}