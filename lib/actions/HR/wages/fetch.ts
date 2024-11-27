'use server'

import { EmployeeDataSchema } from "@/lib/models/HR/EmployeeData.model"
import { DesignationSchema } from "@/lib/models/HR/designation.model"
import Wages from "@/lib/models/HR/wages.model"
import EmployeeData from "@/lib/models/HR/EmployeeData.model"
import WorkOrderHr from "@/lib/models/HR/workOrderHr.model"
import attendanceAction from "../../attendance/attendanceAction"
import mongoose from "mongoose"
import connectToDB from "@/lib/database"
import { DepartmentHrSchema } from "@/lib/models/HR/department_hr"
import { BankSchema } from "@/lib/models/HR/bank.model"
import { endOfYear } from "date-fns"
import { useSearchParams } from "next/navigation"
const designationModel = mongoose.models.Designation || mongoose.model("Designation",DesignationSchema)
const employeeDataModel = mongoose.models.EmployeeData || mongoose.model("EmployeeData",EmployeeDataSchema)
const DepartmentHrModel = mongoose.models.DepartmentHr|| mongoose.model("DepartmentHr",DepartmentHrSchema)
const BankModel  = mongoose.models.Bank || mongoose.model("Bank",BankSchema)

const fetchFilledWages = async(month:number,year:number,workOrderHr:string) => {
    try{
        const filter: Record<string, any> = { month, year};

        if (workOrderHr !== "Default") {
          filter.workOrderHr = workOrderHr;
        }
        console.log(filter,"I am Filter")
        

      // Fetch employees with matching workOrder and period in their workOrderHr
     

      // Populate employee IDs
  
   

    
    const resp = await Wages.find(filter)
    .populate("designation")
    .populate("employee")
    .populate({
      path: "employee",
      populate: {
        path: "designation",
        model: "Designation",
      },
    });
        console.log("bbbbbbbbbbbbbb",resp);
        return{
            success:true,
            status:200,
            message:'Successfully Retrieved Wages',
            data:JSON.stringify(resp)
        }
    }
    catch(err){
        console.log(err)
        return{
            status:500,
            message:'Internal Server Error ',
            err:JSON.stringify(err),
            success:false,
      
        }
    }
}


const fetchWageForAnEmployee = async(dataString:string) => {
    try{
        const data = JSON.parse(dataString)
        const {employee,month,year} = data
        const empData = await EmployeeData.findOne({
            _id: employee
        }).populate("department")
        .populate("designation")
        .populate("ESILocation")
        if(!empData){
            return{
                status:404,
                message:'Employee Not Found',
                success:false,
            }}
        const filter = {
            employee:employee,
            month:month,
            year:year,
        }
        const attendanceRecords  = await attendanceAction.FETCH.fetchStatus(JSON.stringify(filter))
        if(!attendanceRecords){
            return{
                status:404,
                message:'Attendance for the Employee Not Found',
                success:false,
            }}
            const resp = await Wages.find({
                employee:employee,
                month:month,
                year:year
            }).populate("designation").populate("employee")
            console.log(resp);
            return{
                success:true,
                status:200,
                message:'Successfully Retrieved Wages for the Employee',
                data:JSON.stringify(resp)
            }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status: 500,
            err:JSON.stringify(err),
            message:'Internal Server Error'
        }
    }
}


const fetchWagesForFinancialYear = async (dataString) => {
    try {
        const data = JSON.parse(dataString);
        const { year,workOrder,bonusPercentage } = data;
console.log("yeich ", year)
        const startDate = new Date(year, 3, 1); // April of the given year
        console.log(startDate)
        const endDate = new Date(year + 1, 2, 31); // March of the following year
        
        // Fetch all employees whose appointment and resignation dates meet the criteria
        // const employees = await EmployeeData.find({
        //     appointmentDate: { $lte: endDate },
        //     $or: [
        //         { resignDate: { $gte: startDate } },
        //         { resignDate: "" },
        //     ]                
        // }).populate("department")
        //   .populate("designation")
        //   .populate("ESILocation");
        const employees = await EmployeeData.aggregate([
            {
                $addFields: {
                    appointmentDateObj: {
                        $cond: {
                            if: { $eq: ["$appointmentDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$appointmentDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    },
                    resignDateObj: {
                        $cond: {
                            if: { $eq: ["$resignDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$resignDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    appointmentDateObj: { $lte: endDate },
                    $or: [
                        { resignDateObj: { $gte: startDate } },
                        { resignDateObj: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation_details'
                }
            },
            {
                $lookup: {
                    from: 'departmenthrs',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department_details'
                }
            },
        ]);
        console.log("yere employees vaiii", employees)
        
        if (employees.length === 0) {
            return {
                status: 404,
                message: 'No Employees Found',
                success: false,
            };
        }

        // Fetch wages for each employee
        const wagesData = [];
        for (const employee of employees) {
            if(employee.workOrderHr.find(entry=>entry.workOrderHr.toString() === workOrder.toString())){
            console.log(employee.appointmentDate)
            const wages = await Wages.find({
                employee: employee._id,
     //removed

                $or: [
                    { year: year, month: { $in: [4, 5, 6, 7, 8, 9, 10, 11, 12] } },
                    { year: year + 1, month: { $in: [1, 2, 3] } }
                ]
            }).populate("designation").populate("employee");
            console.log("Wages data",wages)
            if(wages.length==0) continue;

            const employeeDoc = await EmployeeData.findById(employee._id);

            const currentYear = new Date().getFullYear();

  // Fetch the employee's bonus data
            // const lastBonusYear = employeeDoc.bonus[employeeDoc.bonus.length - 1].year;
  
            // if (lastBonusYear < currentYear) {
            //   for (let year = lastBonusYear + 1; year <= currentYear; year++) {
            //     employeeDoc.bonus.push({ year, status: false });
            //   }
            // }

            // employeeDoc.bonus = employeeDoc.bonus.map(bonusEntry => {
            //     if (bonusEntry.year === year) {
            //       bonusEntry.status = true;
            //     }
            //     return bonusEntry;
            //   });
            //   await employeeDoc.save();

            // Check for missing months
            const monthsInYear = new Set([4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]);
            const fetchedMonths = new Set(wages.map(wage => wage.month));
            // @ts-ignore
            const missingMonths = [...monthsInYear].filter(month => !fetchedMonths.has(month));

            // Calculate bonus and totalAttendance
           
    // Create objects for missing months with attendance as 0 and netAmountPaid as 0
    const missingWages = missingMonths.map(month => ({
        employee: employee._id,
        designation: null, // or handle as needed
        month: month,
        year: month >= 4 ? year : year + 1,
        attendance: 0,
        netAmountPaid: 0
    }));

    // Concatenate missingWages with fetched wages
    const allWages = [...wages, ...missingWages];

    // Sort allWages by year and month
    allWages.sort((a, b) => {
        if (a.year === b.year) {
            return a.month - b.month;
        } else {
            return a.year - b.year;
        }
    });
     // Find the work order by workOrderNumber and update the bonusRate
     const Store_Update_bp = await WorkOrderHr.findOneAndUpdate(
        { workOrder },
        { bonusRate: bonusPercentage },   // Update the bonus rate field
        { new: true }          // Return the updated document
    );

    // console.log(WorkOrderHr,"bonusRate")
    // console.log(wages,"workorder data!!")

    if (!Store_Update_bp) {
        console.log("Not Found!!!") 
    }
    else {
        console.log("Updated SuccessFully")
    }
    // Calculate bonus and totalAttendance
    const totalNetAmountPaid = allWages.reduce((sum, wage) => sum + wage.netAmountPaid, 0);
    const totalAttendance = allWages.reduce((sum, wage) => sum + wage.attendance, 0);
    const bonus = totalNetAmountPaid * (bonusPercentage/100); //bonusPercentage -> Url
            wagesData.push({
                employee: employee,
                wages: allWages,
                missingMonths: missingMonths,
                bonus: bonus,
                totalNetAmountPaid:totalNetAmountPaid,
                totalAttendance: totalAttendance
            });
        }
        }
       console.log(wagesData,bonusPercentage,"yeiiii hai bhaiii")
            
        return {
            success: true,
            status: 200,
            message: 'Successfully Retrieved Wages for the Financial Year',
            data: JSON.stringify(wagesData)
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: 500,
            err: JSON.stringify(err),
            message: 'Internal Server Error'
        };
    }
};

const fetchWagesForFinancialYearStatement = async (dataString) => {
    try {
        const data = JSON.parse(dataString);
        const { year,workOrder,bonusPercentage} = data;
console.log("yeich ", year)
console.log("bonusPercentage",bonusPercentage)
        const startDate = new Date(year, 3, 1); // April of the given year
        console.log(startDate)
        const endDate = new Date(year + 1, 2, 31); // March of the following year
        
        // Fetch all employees whose appointment and resignation dates meet the criteria
        // const employees = await EmployeeData.find({
        //     appointmentDate: { $lte: endDate },
        //     $or: [
        //         { resignDate: { $gte: startDate } },
        //         { resignDate: "" },
        //     ]                
        // }).populate("department")
        //   .populate("designation")
        //   .populate("ESILocation");
        const employees = await EmployeeData.aggregate([
            {
                $addFields: {
                    appointmentDateObj:{
                        $cond: {
                            if: { $eq: ["$appointmentDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$appointmentDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    },
                    resignDateObj: {
                        $cond: {
                            if: { $eq: ["$resignDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$resignDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    appointmentDateObj: { $lte: endDate },
                    $or: [
                        { resignDateObj: { $gte: startDate } },
                        { resignDateObj: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation_details'
                }
            },
            {
                $lookup: {
                    from: 'departmenthrs',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department_details'
                }
            },
        ]);
console.log("yere employees vaiii", employees)
        if (employees.length === 0) {
            return {
                status: 404,
                message: 'No Employees Found',
                success: false,
            };
        }

        // Fetch wages for each employee
        const wagesData = [];
        for (const employee of employees) {
            console.log(employee.appointmentDate)
            const query = {
                employee: employee._id,
                $or: [
                    { year: year, month: { $in: [4, 5, 6, 7, 8, 9, 10, 11, 12] } },
                    { year: year + 1, month: { $in: [1, 2, 3] } }
                ]
            };
            
            // Conditionally add workOrderHr only when workOrder is not "Default"
            if (workOrder !== "Default") {
                //@ts-ignore
                query.workOrderHr = workOrder;
            }
            

            console.log("kkkkkkkkkkkkkk",query)
            // Perform the query
            const wages = await Wages.find(query)
                .populate("designation")
                .populate("employee");
            if(wages.length==0) continue;
            const employeeDoc = await EmployeeData.findById(employee._id);

            const currentYear = new Date().getFullYear();

  // Fetch the employee's bonus data
  if(!employeeDoc.bonus || employeeDoc.bonus.length==0)
  {
    const startYear = new Date(employeeDoc.appointmentDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const bonusLeaveData = [];

        for (let year = startYear; year <= currentYear; year++) {
            bonusLeaveData.push({ year, status: false });
        }
        employeeDoc.bonus=bonusLeaveData;
  }
            const lastBonusYear = employeeDoc.bonus[employeeDoc.bonus.length - 1].year;
  
            if (lastBonusYear < currentYear) {
              for (let year = lastBonusYear + 1; year <= currentYear; year++) {
                employeeDoc.bonus.push({ year, status: false });
              }
            }

            employeeDoc.bonus = employeeDoc.bonus.map(bonusEntry => {
                if (bonusEntry.year === year) {
                  bonusEntry.status = true;
                }
                return bonusEntry;
              });
              await employeeDoc.save();

            // Check for missing months
            const monthsInYear = new Set([4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]);
            const fetchedMonths = new Set(wages.map(wage => wage.month));
            // @ts-ignore
            const missingMonths = [...monthsInYear].filter(month => !fetchedMonths.has(month));

            // Calculate bonus and totalAttendance
           
    // Create objects for missing months with attendance as 0 and netAmountPaid as 0
    const missingWages = missingMonths.map(month => ({
        employee: employee._id,
        designation: null, // or handle as needed
        month: month,
        year: month >= 4 ? year : year + 1,
        attendance: 0,
        netAmountPaid: 0
    }));

    // Concatenate missingWages with fetched wages
    const allWages = [...wages, ...missingWages];

    // Sort allWages by year and month
    allWages.sort((a, b) => {
        if (a.year === b.year) {
            return a.month - b.month;
        } else {
            return a.year - b.year;
        }
    });

    // Calculate bonus and totalAttendance
    const totalNetAmountPaid = allWages.reduce((sum, wage) => sum + wage.netAmountPaid, 0);
    const totalAttendance = allWages.reduce((sum, wage) => sum + wage.attendance, 0);

    const bonus = totalNetAmountPaid * (bonusPercentage/100);
            wagesData.push({
                employee: employee,
                wages: allWages,
                missingMonths: missingMonths,
                bonus: bonus,
                totalNetAmountPaid:totalNetAmountPaid,
                totalAttendance: totalAttendance
            });
        }
console.log(wagesData,WorkOrderHr,"yeiiii hai bhaiii")
        return {
            success: true,
            status: 200,
            message: 'Successfully Retrieved Wages for the Financial Year',
            data: JSON.stringify(wagesData)
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: 500,
            err: JSON.stringify(err),
            message: 'Internal Server Error'
        };
    }
};


const fetchWagesForCalendarYear = async (dataString) => {
    try {
        await connectToDB()
        const data = JSON.parse(dataString);
        const { year,workOrder } = data;
      console.log(workOrder)
        const startDate = new Date(year, 0, 1); // January 1st of the given year
        const endDate = new Date(year, 11, 31); // December 31st of the given year

        // Fetch all employees whose appointment and resignation dates meet the criteria
        const employees = await EmployeeData.aggregate([
            {
                $addFields: {
                    appointmentDateObj: {
                        $cond: {
                            if: { $eq: ["$appointmentDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$appointmentDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    },
                    resignDateObj: {
                        $cond: {
                            if: { $eq: ["$resignDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$resignDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    appointmentDateObj: { $lte: endDate },
                    $or: [
                        { resignDateObj: { $gte: startDate } },
                        { resignDateObj: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation_details'
                }
            },
            {
                $lookup: {
                    from: 'departmenthrs',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department_details'
                }
            },
        ]);
console.log("yetirerererrere",employees)
        if (employees.length === 0) {
            return {
                status: 404,
                message: 'No Employees Found',
                success: false,
            };
        }

        // Fetch wages for each employee
        const wagesData = [];
        for (const employee of employees) {
            if(employee.workOrderHr.find(entry=>entry.workOrderHr.toString() === workOrder.toString())){
            const wages = await Wages.find({
                employee: employee._id,
                year: year,
                month: { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
            }).populate("designation").populate("employee");
            console.log("okay yeh bh", wages)
            if(wages.length==0) continue;
           // const employeeDoc = await EmployeeData.findById(employee._id);
            const currentYear = new Date().getFullYear();

  // Fetch the employee's bonus data

            // const lastBonusYear = employeeDoc.leave[employeeDoc.leave.length - 1].year;

            // if (lastBonusYear < currentYear) {
            //   for (let year = lastBonusYear + 1; year <= currentYear; year++) {
            //     employeeDoc.leave.push({ year, status: false });
            //   }
            // }

            // employeeDoc.leave = employeeDoc.leave.map(bonusEntry => {
            //     if (bonusEntry.year === year) {
            //       bonusEntry.status = true;
            //     }
            //     return bonusEntry;
            //   });
            //   await employeeDoc.save();
            // Check for missing months
            const monthsInYear = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            const fetchedMonths = new Set(wages.map(wage => wage.month));
            // @ts-ignore
            const missingMonths = [...monthsInYear].filter(month => !fetchedMonths.has(month));
            console.log("okay yeh nh 2")

            // Calculate totalAttendance
            const missingWages = missingMonths.map(month => ({
                employee: employee._id,
                designation: null, // or handle as needed
                month: month,
                year: year,
                attendance: 0,
                netAmountPaid: 0
            }));
        
            // Concatenate missingWages with fetched wages
            const allWages = [...wages, ...missingWages];
        
            // Sort allWages by year and month
            allWages.sort((a, b) => {
             
                    return a.month - b.month;
             
            });
        
            // Calculate bonus and totalAttendance
            const totalNetAmountPaid = allWages.reduce((sum, wage) => sum + wage.netAmountPaid, 0);
            const totalAttendance = allWages.reduce((sum, wage) => sum + wage.attendance, 0);
            // Calculate EL, CL, FL
            const EL = Math.round(totalAttendance / 20);
            const CL = Math.round(totalAttendance / 35);
            const FL = Math.round(totalAttendance / 60);
const tot=EL+CL+FL
console.log(employee.designation_details[0].basic)
const Net=(employee.designation_details[0].basic)*tot + (employee.designation_details[0].DA)*tot
            wagesData.push({
                employee: employee,
                wages: allWages,
                missingMonths: missingMonths,
                totalAttendance: totalAttendance,
                EL: EL,
                CL: CL,
                FL: FL,
                tot:tot,
                basicWages:employee.designation_details[0].basic*tot,
                totalDA:employee.designation_details[0].DA*tot,
                Net:Net
            });
        }
        }
        console.log("okay yeh nh 3")

        return {
            success: true,
            status: 200,
            message: 'Successfully Retrieved Wages for the Calendar Year',
            data: JSON.stringify(wagesData)
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: 500,
            err: JSON.stringify(err),
            message: 'Internal Server Error'
        };
    }
};

// const fetchFinalSettlement = async (dataString) => {
//     try {
//         const data = JSON.parse(dataString);
//         const { employee } = data;

//         // Fetch employee data
//         const empData = await EmployeeData.findOne({ _id: employee })
//             .populate("department")
//             .populate("designation")
//             .populate("ESILocation");

//         if (!empData) {
//             return {
//                 status: 404,
//                 message: 'Employee Not Found',
//                 success: false,
//             };
//         }

//         const appointmentDate = new Date(empData.appointmentDate);
//         const currentDate = new Date();

//         // Fetch all wages for the employee from the appointment date to the current month
//         const wages = await Wages.find({
//             employee: employee,
//             year: { $gte: appointmentDate.getFullYear(), $lte: currentDate.getFullYear() },
//             $or: [
//                 { month: { $gte: appointmentDate.getMonth() + 1 } },
//                 { month: { $lte: currentDate.getMonth() + 1 } }
//             ]
//         }).populate("designation").populate("employee");

//         if (wages.length === 0) {
//             return {
//                 status: 404,
//                 message: 'No Wages Found for the Employee',
//                 success: false,
//             };
//         }

//         // Organize wages by year and calculate missing months and total attendance for each year
//         const wagesByYear = {};

//         for (const wage of wages) {
//             const { year, month, attendance } = wage;
//             if (!wagesByYear[year]) {
//                 wagesByYear[year] = {
//                     wages: [],
//                     missingMonths: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
//                     totalAttendance: 0
//                 };
//             }
//             wagesByYear[year].wages.push(wage);
//             wagesByYear[year].missingMonths.delete(month);
//             wagesByYear[year].totalAttendance += attendance;
//         }

//         // Convert missing months sets to arrays
//         for (const year in wagesByYear) {
//             wagesByYear[year].missingMonths = Array.from(wagesByYear[year].missingMonths);
//         }

//         return {
//             success: true,
//             status: 200,
//             message: 'Successfully Retrieved Final Settlement Wages for the Employee',
//             data: wagesByYear
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             success: false,
//             status: 500,
//             err: JSON.stringify(err),
//             message: 'Internal Server Error'
//         };
//     }
// };


// const fetchFinalSettlement = async (dataString) => {
//     try {
//         await connectToDB()
//         const data = JSON.parse(dataString);
//         const { employee } = data;

//         // Fetch employee data
//         const empData = await EmployeeData.findOne({ _id: employee })
//             .populate("designation")
         

//         if (!empData) {
//             return {
//                 status: 404,
//                 message: 'Employee Not Found',
//                 success: false,
//             };
//         }

//         const appointmentDate = new Date(empData.appointmentDate);
//         const currentDate = new Date();

//         // Fetch all wages for the employee from the appointment date to the current month
//         const wages = await Wages.find({
//             employee: employee,
//             year: { $gte: appointmentDate.getFullYear(), $lte: currentDate.getFullYear() },
//             $or: [
//                 { month: { $gte: appointmentDate.getMonth() + 1 } },
//                 { month: { $lte: currentDate.getMonth() + 1 } }
//             ]
//         }).populate("designation").populate("employee");

//         if (wages.length === 0) {
//             return {
//                 status: 404,
//                 message: 'No Wages Found for the Employee',
//                 success: false,
//             };
//         }

//         // Organize wages by month-year and calculate total attendance and total net amount paid per year
//         const wagesByMonthYear = {};
//         const totalAttendancePerYear = [];
// let totAtt=0;
//         for (const wage of wages) {
//             const { year, month, attendance, netAmountPaid } = wage;
//             const key = `${year}-${month}`;

//             if (!wagesByMonthYear[key]) {
//                 wagesByMonthYear[key] = wage;
//             }
//             let attendanceYear = totalAttendancePerYear.find(item => item.year === year);
//             if (!attendanceYear) {
//                 attendanceYear = { year, totalAttendance: 0,totalNetAmountPaid:0 };
//                 totalAttendancePerYear.push(attendanceYear);
//             }
           
//             attendanceYear.totalAttendance += attendance;
//             totAtt+=attendance;
//             attendanceYear.totalNetAmountPaid += netAmountPaid;
//             // Update totalNetAmountPaidPerYear
           
//         }
// for(let i=0;i<totalAttendancePerYear.length;i++)
// {
//     totalAttendancePerYear[i].EL = Math.round(totalAttendancePerYear[i].totalAttendance / 20);
//     totalAttendancePerYear[i].CL = Math.round(totalAttendancePerYear[i].totalAttendance/ 35);
//     totalAttendancePerYear[i].FL = Math.round(totalAttendancePerYear[i].totalAttendance/ 60);
   
//     totalAttendancePerYear[i].leave=(totalAttendancePerYear[i].EL+totalAttendancePerYear[i].CL+totalAttendancePerYear[i].FL)*empData.designation.PayRate;

// }
        
//         // Add missing months with zero values
//         let totWages=0;
//         const allYears = totalAttendancePerYear.map(item => item.year);
//         for (const year of allYears) {
//             for (let month = 1; month <= 12; month++) {
//                 const key = `${year}-${month}`;
//                 if (!wagesByMonthYear[key]) {
//                     wagesByMonthYear[key] = {
//                         employee: employee,
//                         designation: null, // or handle as needed
//                         month: month,
//                         year: parseInt(year),
//                         attendance: 0,
//                         netAmountPaid: 0,
//                         totalWorkingDays: 0,
//                         total: 0,
//                         payRate: 0,
//                         otherCash: 0,
//                         allowances: 0,
//                         otherCashDescription: "{}",
//                         otherDeduction: 0,
//                         otherDeductionDescription: "{}",
//                     };
//                 }
//             }
//         }

//         // Convert the wagesByMonthYear object to a sorted array
//         const sortedWages = Object.values(wagesByMonthYear).sort((a, b) => {
//             // @ts-ignore
//             if (a.month === b.month) {
//                 // @ts-ignore
//                 return a.year - b.year;
//             } else {
//                 // @ts-ignore
//                 return a.month - b.month;
//             }
//         });
//         console.log("yei toh hn sorted", sortedWages)
//         const dataByMonth = {};

//         sortedWages.forEach(wage => {
//             // @ts-ignore
//           const { month, year, attendance, netAmountPaid } = wage;
      
//           // Create a new array for the month if it doesn't exist
//           if (!dataByMonth[month]) {
//             dataByMonth[month] = [];
//           }
      
//           // Add the data for the current month and year
//           totWages+=netAmountPaid;
//           dataByMonth[month].push({
//             year,
//             attendance,
//             netAmountPaid
//           });
//         });
//         totalAttendancePerYear.sort((a, b) => a.year - b.year);
//       const finalData={
//         wages: dataByMonth,
//         totalAttendancePerYear: totalAttendancePerYear,
//         designation:empData.designation,
//         employee:empData,
//         totalAttendance:totAtt,
//         totalWages:totWages
       
//     }
//         return {
//             success: true,
//             status: 200,
//             message: 'Successfully Retrieved Final Settlement Wages for the Employee',
//             data: JSON.stringify(finalData)
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             success: false,
//             status: 500,
//             err: JSON.stringify(err),
//             message: 'Internal Server Error'
//         };
//     }
// };

const fetchWagesForCalendarYearStatement = async (dataString) => {
    try {
        await connectToDB()
        const data = JSON.parse(dataString);
        const { year,workOrder } = data;
      console.log(workOrder)
        const startDate = new Date(year, 0, 1); // January 1st of the given year
        const endDate = new Date(year, 11, 31); // December 31st of the given year

        // Fetch all employees whose appointment and resignation dates meet the criteria
        const employees = await EmployeeData.aggregate([
            {
                $addFields: {
                    appointmentDateObj: {
                        $cond: {
                            if: { $eq: ["$appointmentDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$appointmentDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    },
                    resignDateObj: {
                        $cond: {
                            if: { $eq: ["$resignDate", ""] },
                            then: null,
                            else: {
                                $dateFromString: {
                                    dateString: "$resignDate",
                                    format: "%d-%m-%Y"
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    appointmentDateObj: { $lte: endDate },
                    $or: [
                        { resignDateObj: { $gte: startDate } },
                        { resignDateObj: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation_details'
                }
            },
            {
                $lookup: {
                    from: 'departmenthrs',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department_details'
                }
            },
        ]);
        const names=employees.map(emp=>emp._id)
console.log("yetirerererrere",names)
        if (employees.length === 0) {
            return {
                status: 404,
                message: 'No Employees Found',
                success: false,
            };
        }

        // Fetch wages for each employee
        const wagesData = [];
        for (const employee of employees) {

            const query = {
                employee: employee._id,
                $or: [
                    { year: year,                 month: { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
                },
                ]
            };
            
            // Conditionally add workOrderHr only when workOrder is not "Default"
            if (workOrder !== "Default") {
                //@ts-ignore
                query.workOrderHr =new mongoose.Types.ObjectId(workOrder);
            }
            

            console.log("kkkkkkkkkkkkkk",query)
            // Perform the query
            const wages = await Wages.find(query)
                .populate("designation")
                .populate("employee");
         
            console.log("okay yeh bh", wages)
            if(wages.length==0) continue;
            const employeeDoc = await EmployeeData.findById(employee._id);
            const currentYear = new Date().getFullYear();

  // Fetch the employee's bonus data
  if(!employeeDoc.leave || employeeDoc.leave.length==0)
    {
      const startYear = new Date(employeeDoc.appointmentDate).getFullYear();
          const currentYear = new Date().getFullYear();
          const bonusLeaveData = [];
  
          for (let year = startYear; year <= currentYear; year++) {
              bonusLeaveData.push({ year, status: false });
          }
          employeeDoc.leave=bonusLeaveData;
    }

            const lastBonusYear = employeeDoc.leave[employeeDoc.leave.length - 1].year;

            if (lastBonusYear < currentYear) {
              for (let year = lastBonusYear + 1; year <= currentYear; year++) {
                employeeDoc.leave.push({ year, status: false });
              }
            }

            employeeDoc.leave = employeeDoc.leave.map(bonusEntry => {
                if (bonusEntry.year === year) {
                  bonusEntry.status = true;
                }
                return bonusEntry;
              });
              await employeeDoc.save();
            // Check for missing months
            const monthsInYear = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            const fetchedMonths = new Set(wages.map(wage => wage.month));
            // @ts-ignore
            const missingMonths = [...monthsInYear].filter(month => !fetchedMonths.has(month));
            console.log("okay yeh nh 2")

            // Calculate totalAttendance
            const missingWages = missingMonths.map(month => ({
                employee: employee._id,
                designation: null, // or handle as needed
                month: month,
                year: year,
                attendance: 0,
                netAmountPaid: 0
            }));
        
            // Concatenate missingWages with fetched wages
            const allWages = [...wages, ...missingWages];
        
            // Sort allWages by year and month
            allWages.sort((a, b) => {
             
                    return a.month - b.month;
             
            });
        
            // Calculate bonus and totalAttendance
            const totalNetAmountPaid = allWages.reduce((sum, wage) => sum + wage.netAmountPaid, 0);
            const totalAttendance = allWages.reduce((sum, wage) => sum + wage.attendance, 0);
            // Calculate EL, CL, FL
            const EL = Math.round(totalAttendance / 20);
            const CL = Math.round(totalAttendance / 35);
            const FL = Math.round(totalAttendance / 60);
const tot=EL+CL+FL
console.log(employee.designation_details[0].basic)
const Net=(employee.designation_details[0].basic)*tot + (employee.designation_details[0].DA)*tot
const leave=(employee.designation_details[0].PayRate)*tot
            wagesData.push({
                employee: employee,
                wages: allWages,
                missingMonths: missingMonths,
                totalAttendance: totalAttendance,
                EL: EL,
                CL: CL,
                FL: FL,
                tot:tot,
                basicWages:employee.designation_details[0].basic*tot,
                totalDA:employee.designation_details[0].DA*tot,
                Net:Net,
                leave:leave
            });
        }
        console.log("okay yeh nh 3")

        return {
            success: true,
            status: 200,
            message: 'Successfully Retrieved Wages for the Calendar Year',
            data: JSON.stringify(wagesData)
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: 500,
            err: JSON.stringify(err),
            message: 'Internal Server Error'
        };
    }
};


const fetchFinalSettlement = async (dataString) => {
    try {
        await connectToDB();
        const data = JSON.parse(dataString);
        const { employee } = data;

        // Fetch employee data
        console.log("ok1 ")
        const empData = await EmployeeData.findOne({ _id: employee })
            .populate("designation");

        if (!empData) {
            return {
                status: 404,
                message: 'Employee Not Found',
                success: false,
            };
        }

        const appointmentDate = new Date(empData.appointmentDate);
        const currentDate = new Date();
console.log("yeri date",empData.appointmentDate)
        // Fetch all wages for the employee from the appointment date to the current month
        const wages = await Wages.find({
            employee: employee,
            year: { $gte: appointmentDate.getFullYear(), $lte: currentDate.getFullYear() },
            $or: [
                { month: { $gte: appointmentDate.getMonth() + 1 } },
                { month: { $lte: currentDate.getMonth() + 1 } }
            ]
        }).populate("designation").populate("employee");
        //  console.log("yeri wages",wages)
        if (wages.length === 0) {
            return {
                status: 404,
                message: 'No Wages Found for the Employee',
                success: false,
            };
        }

        // Organize wages by month-year and calculate total attendance and total net amount paid per year
        const wagesByMonthYear = {};
        const totalAttendancePerYear = [];
        let totAtt = 0;
console.log("ok2 & wages ",wages)
        for (const wage of wages) {
            const { year, month, attendance, netAmountPaid } = wage;
            const key = `${year}-${month}`;
            const key2 = `${year}-${month}+${Math.random()}`;


            if (!wagesByMonthYear[key2]) {
                wagesByMonthYear[key2] = wage;
            }
            let attendanceYear = totalAttendancePerYear.find(item => item.year === year);
            const paidStatus = empData.leave.find(b => b.year === year)?.status || false;

            if (!attendanceYear) {
                attendanceYear = { year, totalAttendance: 0, totalNetAmountPaid: 0,status:paidStatus };
                totalAttendancePerYear.push(attendanceYear);
            }

            attendanceYear.totalAttendance += attendance;
            totAtt += attendance;
            attendanceYear.totalNetAmountPaid += netAmountPaid;
        }

        const startYear = appointmentDate.getFullYear();
const endYear = currentDate.getFullYear();

for (let year = startYear; year <= endYear; year++) {
    if (!totalAttendancePerYear.some(item => item.year === year)) {
        totalAttendancePerYear.push({
            year: year,
            totalAttendance: 0,
            totalNetAmountPaid: 0,
            status: false  // assuming default paid status as false for years with no data
        });
    }
}
        for (let i = 0; i < totalAttendancePerYear.length; i++) {
            totalAttendancePerYear[i].EL = Math.round(totalAttendancePerYear[i].totalAttendance / 20);
            totalAttendancePerYear[i].CL = Math.round(totalAttendancePerYear[i].totalAttendance / 35);
            totalAttendancePerYear[i].FL = Math.round(totalAttendancePerYear[i].totalAttendance / 60);

            totalAttendancePerYear[i].leave = (totalAttendancePerYear[i].EL + totalAttendancePerYear[i].CL + totalAttendancePerYear[i].FL) * empData.designation.PayRate;
        }

        // Add missing months with zero values
        let totWages = 0;
        console.log("ok412",wagesByMonthYear)
        const allYears = totalAttendancePerYear.map(item => item.year);
        const allWgaes = []
        for (const year of allYears) {
            for (let month = 1; month <= 12; month++) {
                const key = `${year}-${month}`;
                    wagesByMonthYear[key] = {
                        employee: employee,
                        designation: null, // or handle as needed
                        month: month,
                        year: parseInt(year),
                        attendance: 0,
                        netAmountPaid: 0,
                        totalWorkingDays: 0,
                        total: 0,
                        payRate: 0,
                        otherCash: 0,
                        allowances: 0,
                        otherCashDescription: "{}",
                        otherDeduction: 0,
                        otherDeductionDescription: "{}",
                    };
                
            }
        }

        // Convert the wagesByMonthYear object to a sorted array
        const sortedWages = Object.values(wagesByMonthYear).sort((a, b) => {
              // @ts-ignore
            if (a.year === b.year) {
                  // @ts-ignore
                return a.month - b.month;
            } else {
                  // @ts-ignore
                return a.year - b.year;
            }
        });
console.log("yeri sortedwages real vali 21",wagesByMonthYear)
        const dataByMonth = {};
        sortedWages.forEach(wage => {
              // @ts-ignore
            const { month, year, attendance, netAmountPaid } = wage;

            if (!dataByMonth[month]) {
                dataByMonth[month] = [];
            }


            totWages += netAmountPaid;
            dataByMonth[month].push({
                year,
                attendance,
                netAmountPaid
            });
        });
        console.log("dataByMonth3",dataByMonth)
        
const aggregateDataByMonth = (data) => {
    Object.keys(data).forEach((month) => {
      const yearData = data[month];
  
      // Reduce the array by grouping by year and summing attendance and netAmountPaid
      const aggregated = yearData.reduce((acc, { year, attendance, netAmountPaid }) => {
        if (!acc[year]) {
          acc[year] = { year, attendance: 0, netAmountPaid: 0 };
        }
        acc[year].attendance += attendance;
        acc[year].netAmountPaid += netAmountPaid;
        return acc;
      }, {});
  
      // Convert the aggregated data back to an array
      data[month] = Object.values(aggregated);
    });
  
    return data;
  };
  
  const aggregatedData = aggregateDataByMonth(dataByMonth);
  console.log("data!!!",aggregatedData)
        // Calculate gross wages and bonus details
        const bonusDetails = [];
        let currentYear = appointmentDate.getFullYear();

        while (currentYear <= currentDate.getFullYear()) {
            const startMonth =  4;
            const endMonth = 3;

            let grossWages = 0;
            const keys = Object.keys(wagesByMonthYear) //array
            for (let month = startMonth; month <= 12; month++) {
                const key = `${currentYear}-${month}`;
                if (wagesByMonthYear[key]) {
                    grossWages += wagesByMonthYear[key].netAmountPaid;
                }
               
            }
            let nex=currentYear+1;
            for (let month = 1; month <= endMonth; month++) {
                const key = `${nex}-${month}`;
                if (wagesByMonthYear[key]) {
                    grossWages += wagesByMonthYear[key].netAmountPaid;
                }
            }
            const bonusStatus = empData.bonus.find(b => b.year === currentYear)?.status || false;


            bonusDetails.push({
                year: currentYear,
                grossWages: grossWages,
                bonus: grossWages * 0.0833,
                status: bonusStatus

            });

            currentYear++;
        }

        
        totalAttendancePerYear.sort((a, b) => a.year - b.year);
        const finalData = {
            wages: dataByMonth,
            totalAttendancePerYear: totalAttendancePerYear,
            designation: empData.designation,
            employee: empData,
            totalAttendance: totAtt,
            totalWages: totWages,
            bonusDetails: bonusDetails
        };

        return {
            success: true,
            status: 200,
            message: 'Successfully Retrieved Final Settlement Wages for the Employee',
            data: JSON.stringify(finalData)
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: 500,
            err: JSON.stringify(err),
            message: 'Internal Server Error'
        };
    }
};


export {fetchFilledWages, fetchWageForAnEmployee, fetchWagesForFinancialYear, fetchWagesForCalendarYear, fetchFinalSettlement, fetchWagesForFinancialYearStatement, fetchWagesForCalendarYearStatement}