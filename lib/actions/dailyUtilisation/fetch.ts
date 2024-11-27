'use server'

import connectToDB from "@/lib/database"
import DailyUtilisation from "@/lib/models/dailyUtilisation.model"
import { VehicleSchema } from "@/lib/models/vehicle.model";
import { WorkOrderSchema } from "@/lib/models/workOrder.model";
import mongoose from "mongoose";

const workOrderModel =
  mongoose.models.WorkOrder || mongoose.model("WorkOrder", WorkOrderSchema);

const vehicleModel = mongoose.models.Vehicle || mongoose.model("Vehicle",VehicleSchema)

const fetchDailyUtilisation = async(vehicleId, month, year) => {
    try {
        await connectToDB();
        console.log(vehicleId);
        console.log(month);
        console.log(year);
        
        const resp = await DailyUtilisation.find({
            vehicle: new mongoose.Types.ObjectId(vehicleId),
            month:month,
            year:year
        }).populate('vehicle','vehicleNumber').populate('workOrder','workOrderNumber');
        
        return {
            success: true,
            data: JSON.stringify(resp),
            message: 'Daily Utilisation Fetched'
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            status: 500,
            message: "Error fetching daily utilisation data"
        };
    }
};

export default fetchDailyUtilisation