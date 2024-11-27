'use server'

import connectToDB from "@/lib/database"
import Compliance from "@/lib/models/compliances.model";
import Consumable from "@/lib/models/consumables.model";
import FuelManagement from "@/lib/models/fuelManagement.model";

const fetchAnalytics = async(dataString:string) => {
    try{
        await connectToDB();
        const obj = JSON.parse(dataString);
        let vehicleNumber = obj.vehicleNumber
        let month = obj.month
        let year = obj.year
        let docId = month+year
        let totalFuelCost = 0
        let compliancesCost = 0
        const fuelDocs = await FuelManagement.find({
            vehicleNumber:vehicleNumber,
            DocId:docId
        })
        fuelDocs.forEach((doc)=>{
            if(doc.entry){
                totalFuelCost += doc.amount
            }
            else{
                totalFuelCost -= doc.amount
            }
        })
        const compliancesDocs = await Compliance.find({
            vehicleNumber:vehicleNumber,
            DocId:docId
        })
        compliancesDocs.forEach((doc)=>{
            compliancesCost += doc.amount
        })
        const consumablesDocs = await Consumable.find({
            vehicleNumber:vehicleNumber,
            DocId:docId
        })
        let totalConsumablesCost = 0
        consumablesDocs.forEach((doc)=>{
            totalConsumablesCost += doc.amount
        })
        let resultObj = {
            fuelCost:totalFuelCost,
            compliancesCost:compliancesCost,
            consumablesCost:totalConsumablesCost,
            totalCost:totalFuelCost+compliancesCost+totalConsumablesCost
        }
        return{
            success:true,
            message:'Data Retrieved',
            status:200,
            data:JSON.stringify(resultObj)
        }
    }
    catch(err){
        return{
            success:false,
            message:'Internal Server Error',
            status:500,
            err:JSON.stringify(err)
        }
    }
}

export {fetchAnalytics}