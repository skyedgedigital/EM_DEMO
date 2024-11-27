'use server'

import connectToDB from "@/lib/database"
import Chalan from "@/lib/models/chalan.model";
import Employee from "@/lib/models/employee.model";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";
import Vehicle from "@/lib/models/vehicle.model";

const fetchVehicleHoursAnalytics = async() => {
    try{
        await connectToDB();
        let totalHours = 0
        const resp = await Chalan.find({
            verified:true
        })
        if(resp){
            resp.forEach((chalan)=>{
                let itemsList = chalan.items
                itemsList.forEach((item)=>{
                    if(item.unit === "hours"){
                        totalHours += item.hours
                    }
                })
            })
        }
        console.log(totalHours)
        return{
            success:true,
            status:200,
            data:totalHours,
            message:'Vehicle Hours Fetched'
        }
    }
    catch(err){
        return{
            error: JSON.stringify(err.message),
            status: 500,
            success:false
        }
    }
}

const fetchTotalVehicles = async() => {
    try{
        await connectToDB();
        const resp = await Vehicle.countDocuments()
        return{
            success:true,
            message:"Vehicle Number Fetched",
            data:resp,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

const fetchDriversCount = async() => {
    try{
        await connectToDB();
        const resp = await Employee.find({
            employeeRole:"DRIVER"
        }).countDocuments()
        return{
            success:true,
            message:"DRIVER Number Fetched",
            data:resp,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

const fetchFleetManagersCount = async() => {
    try{
        await connectToDB();
        const resp = await Employee.find({
            employeeRole:"FLEETMANAGER"
        }).countDocuments()
        return{
            success:true,
            message:"FLEETMANAGER Number Fetched",
            data:resp,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

const fetchHRCount = async() => {
    try{
        await connectToDB();
        const resp = await Employee.find({
            employeeRole:"HR"
        }).countDocuments()
        return{
            success:true,
            message:"HR Number Fetched",
            data:resp,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

const fetchSafetyManagerCount = async() => {
    try{
        await connectToDB();
        const resp = await Employee.find({
            employeeRole:"Safety"
        }).countDocuments()
        return{
            success:true,
            message:"SAFETY Number Fetched",
            data:resp,
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

const fetchHrEmps = async() => {
    try{
        await connectToDB();
        const resp = await EmployeeData.find({}).countDocuments();
        return{
            success:true,
            status:200,
            message:"Hr Emps Fetched",
            data:resp
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'Internal Server Error'
        }
    }
}

export {fetchVehicleHoursAnalytics,fetchTotalVehicles,fetchDriversCount,fetchFleetManagersCount,fetchHRCount,fetchSafetyManagerCount,fetchHrEmps}