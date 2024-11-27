'use server'

import connectToDB from "@/lib/database"
import FuelManagement from "@/lib/models/fuelManagement.model";

const fetchFuelManagement = async(vehicleNumber:string,month:string,year:string) => {
    try{
        await connectToDB();
        let total = 0
        const docs = await FuelManagement.find({
            vehicleNumber:vehicleNumber,
            DocId:month+year
        })
        for(let i=0;i<docs.length;i++){
           if(docs[i].entry){
            total += docs[i].amount
           }
           else{
            total -= docs[i].amount
           }
        }
        console.log("The Docs",docs)
        return{
            success:true,
            status:200,
            message:'Data Fetched',
            data:JSON.stringify(docs),
            total:total
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export {fetchFuelManagement}