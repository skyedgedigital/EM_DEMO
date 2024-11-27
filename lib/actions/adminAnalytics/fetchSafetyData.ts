'use server'

import connectToDB from "@/lib/database"
import ChemicalPurchase from "@/lib/models/safetyPanel/chemicals/chemicalPurchase.model";
import PpePurchase from "@/lib/models/safetyPanel/ppe/ppePurchase.model";
import SafetyToolPurchase from "@/lib/models/safetyPanel/tools/toolPurchase.model";

const chemicalPurchaseSpend = async () => {
    try {
        await connectToDB();
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentYear = String(currentDate.getFullYear()); 
        const monthYearPattern = `-${currentMonth}-${currentYear}$`;

        const resp = await ChemicalPurchase.find({
            date: { $regex: monthYearPattern }
        });

        const total = resp.reduce((sum, doc) => sum + doc.price, 0);
        console.log("Filtered Documents:", resp);
        console.log("Total Price Calculated:", total);
        return {
            success: true,
            status: 200,
            data: total
        };
    } catch (err) {
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error'
        };
    }
};

const ppePurchaseSpend = async() => {
    try{
        await connectToDB();
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentYear = String(currentDate.getFullYear()); 
        const monthYearPattern = `-${currentMonth}-${currentYear}$`;

        const resp = await PpePurchase.find({
            date: { $regex: monthYearPattern }
        });

        const total = resp.reduce((sum, doc) => sum + doc.price, 0);
        console.log("Filtered Documents:", resp);
        console.log("Total Price Calculated:", total);
        return {
            success: true,
            status: 200,
            data: total
        };
    }
    catch(err){
        return{
            success: false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

const toolPurchaseSpend = async() => {
    try{
        await connectToDB();
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentYear = String(currentDate.getFullYear()); 
        const monthYearPattern = `-${currentMonth}-${currentYear}$`;

        const resp = await SafetyToolPurchase.find({
            date: { $regex: monthYearPattern }
        });

        const total = resp.reduce((sum, doc) => sum + doc.price, 0);
        console.log("Filtered Documents:", resp);
        console.log("Total Price Calculated:", total);
        return {
            success: true,
            status: 200,
            data: total
        };
    }
    catch(err){
        return{
            success: false,
            status:500,
            message:"Internal Server Error"
        }
    }
}

export {chemicalPurchaseSpend,ppePurchaseSpend,toolPurchaseSpend}
