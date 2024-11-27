'use server'

import connectToDB from "@/lib/database"
import Test from "@/lib/models/test.model";

const testFunction = async(chalanDetails:any) => {
    try{
        await connectToDB();
        console.log("Chalan Details",chalanDetails);
        // const obj = new Test({
        //     ...chalanDetails
        // })
        // const obj = new  Test(JSON.parse(JSON.stringify(chalanDetails)));
        const obj = new Test({
            workOrder:chalanDetails.workOrder,
            // items:[
            //     {
            //         itemId:chalanDetails.items[0].itemId,
            //         name:chalanDetails.items[0].name
            //     }
            // ]
        })
        const resp = await obj.save();
        const ChalanId = console.log(resp._id);
        const result = await Test.findOneAndUpdate({
            workOrder:chalanDetails.workOrder
        },
        {
            $push:{
                items: chalanDetails.items
            }
        },
        {
            new:true
        }
    )
        console.log("The Results ",result)
        return{
            success:true,
            messgae:"Data inserted successfully in the database.",
            data:JSON.stringify(result),
        }
    }
    catch(err){
        console.log(err);
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error:err.message || "An unknown Server Error Occurred!"
        }
    }
}

export {testFunction}