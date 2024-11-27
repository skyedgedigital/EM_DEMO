'use server'

import Chalan from "@/lib/models/chalan.model";
import Compliance from "@/lib/models/compliances.model";
import FuelManagement from "@/lib/models/fuelManagement.model";

const monthNameToNumber = (monthName: string): number => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = monthNames.indexOf(monthName);
    return monthIndex !== -1 ? monthIndex + 1 : -1; // Months are 1-based
  };

const getVehiclesWithHours = async(month:string,year:string) => {
    try {
        // Convert the month name to a number and the year to a number
        const monthNum = monthNameToNumber(month);
        const yearNum = parseInt(year, 10);
  
        // Validate month and year
        if (monthNum === -1 || isNaN(yearNum)) {
            throw new Error('Invalid month or year');
        }
  
        // Calculate start and end dates for the given month and year
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
  
        // Query chalans based on the date range, without filtering by vehicle number
        const chalans = await Chalan.find({
          date: { $gte: startDate, $lte: endDate },
          'items.unit': { $nin: ['fixed', 'shift'] }
        }).exec();
  
        // Initialize a map to store data for each vehicle
        const vehicleData = {};
  
        // Iterate over the chalans and their items to extract the required fields
        chalans.forEach(chalan => {
            chalan.items.forEach(item => {
                const vehicleNumber = item.vehicleNumber;
                if (!['fixed', 'shift'].includes(item.unit)) {
                    if (!vehicleData[vehicleNumber]) {
                        vehicleData[vehicleNumber] = {
                            vehicleNumber,
                            totalHours: 0,
                            totalCost: 0,
                            chalans: [],
                            totalFuel:0,
                            fuelCost:0,
                            complianceCost:0
                        };
                    }
                    vehicleData[vehicleNumber].chalans.push({
                        chalan: chalan.chalanNumber,
                        amount: item.itemCosting,
                        hours: item.hours
                    });
                    vehicleData[vehicleNumber].totalHours += item.hours;
                    vehicleData[vehicleNumber].totalCost += item.itemCosting;
                }
            });
        });

        let fuelManagementDocs = await FuelManagement.find({
            month:month,
            year:yearNum
        })

        fuelManagementDocs.forEach((ele)=>{
            vehicleData[ele.vehicleNumber].totalFuel += ele.fuel
            vehicleData[ele.vehicleNumber].fuelCost += ele.amount
        })

        let complianceDocs = await Compliance.find({
            month:month,
            year:yearNum
        })

        complianceDocs.forEach((ele)=>{
            vehicleData[ele.vehicleNumber].complianceCost += ele.amount
        })  

        const result = Object.values(vehicleData);
  
        return {
            success: true,
            status: 200,
            data: JSON.stringify(result)
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error',
            error: JSON.stringify(err)
        };
    }
}

export default getVehiclesWithHours