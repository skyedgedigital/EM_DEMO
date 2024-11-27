'use server'

import connectToDB from "@/lib/database";
import Item from "@/lib/models/item.model";

const deleteItemByItemNumber = async(itemNumber:number) => {
    try{
        await connectToDB();
        const ifExists = await Item.findOne({
            itemNumber:itemNumber
        })
        if(!ifExists){
            return{
                success:false,
                message:`Item with number ${itemNumber} not found`,
                status:404,
            }
        }
        await Item.findOneAndDelete({
            itemNumber:itemNumber
        });
        return{
            success:true,
            status:200,
            message:`Item with Number ${itemNumber} deleted`
        }
    }
    catch(err){
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: JSON.stringify(err.message) || 'Unknown error occurred'
        };
    }
}

export {deleteItemByItemNumber}