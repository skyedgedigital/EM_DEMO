'use server'

import connectToDB from "@/lib/database";
import Consumable from "@/lib/models/consumables.model";

const fetchConsumables = async(vehicleNumber:string) => {
    try {
        await connectToDB();
        const resp = await Consumable.find({
            vehicleNumber:vehicleNumber
        })
        console.log(resp)
        return {
          success: true,
          status: 200,
          message: "Consumable saved",
          data: JSON.stringify(resp),
        };
      } catch (err) {
        return {
          err: JSON.stringify(err),
          success: false,
          status: 500,
          message: "Error saving consumable",
        };
      }
}

export {fetchConsumables}