'use server'
import connectToDB from "@/lib/database";
import Chalan from "@/lib/models/chalan.model";
import Item from "@/lib/models/item.model";
import WorkOrder from "@/lib/models/workOrder.model";
import { calcPrice } from "@/utils/calcPrice";

const fn = async (chalanId: any) => {
    try {
        await connectToDB();
        const chalan = await Chalan.findById(chalanId);
        if (!chalan) {
            return {
                success: false,
                status: 404,
                error: 'Chalan not found',
                message: 'Chalan not found'
            };
        }

        const chalanItems = chalan.items;
        const chalanWorkOrder = chalan.workOrder;
        const chalanWorkOrderDetails = await WorkOrder.findOne({
            _id:chalanWorkOrder
        });
        let shiftStatus = chalanWorkOrderDetails.shiftStatus;
        console.log(chalanWorkOrderDetails)
        let total = 0
        for (const item of chalanItems) {
            console.log(item.unit);
            const fetchedItem = await Item.findById(item.item);
            if (!fetchedItem) {
                console.error(`Item with ID ${item.item} not found`);
                continue;
            }
            let quantity = item.hours
            let unit = item.unit
            console.log("Quantity ->",quantity," Price ->",fetchedItem.itemPrice,"Unit",unit)
            item.itemCosting = calcPrice(quantity,fetchedItem.itemPrice,item.unit)
            total += item.itemCosting
        }
        chalan.totalCost = total
        await chalan.save()

        // Return success response
        return {
            success: true,
            status: 200,
            message: 'Item costs updated successfully'
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            status: 500,
            error: JSON.stringify(err),
            message: 'Internal server Error'
        };
    }
}

export { fn };
