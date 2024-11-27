'use server'

import connectToDB from "@/lib/database";
import Consumable from "@/lib/models/consumables.model";

const deleteConsumables = async(consumableId:any) => {
    try {
        await connectToDB();
        const resp = await Consumable.findByIdAndDelete(consumableId)
    
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

export {deleteConsumables}