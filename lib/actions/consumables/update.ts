'use server'

import connectToDB from "@/lib/database";
import Consumable from "@/lib/models/consumables.model";

const updateConsumables = async(consumableId:any,updatesString:string) => {
    try {
        await connectToDB();
        let updatesObj = JSON.parse(updatesString)
        const resp = await Consumable.findByIdAndUpdate(consumableId,updatesObj,{new:true});
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

export {updateConsumables}