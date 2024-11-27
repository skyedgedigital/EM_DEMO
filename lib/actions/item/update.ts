'use server'

import connectToDB from "@/lib/database"
import Item from "@/lib/models/item.model";

const updateItem = async(itemId:any,updates:any) => {
    try{    
        await connectToDB();
        const filter = {
            _id:itemId
        }
        const updatedItem = await Item.findOneAndUpdate(filter,updates,{new:true});
        return{
            status:200,
            data:updatedItem,
            message:'Item updated successfully'
        }
    }
    catch(err){
        return{
            status:500,
            err:JSON.stringify(err),
            message:'Internal Server Error'
        }
    }
}

export {updateItem}