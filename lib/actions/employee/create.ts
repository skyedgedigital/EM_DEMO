'use server'
import connectToDB from "@/lib/database";
import Admin from "@/lib/models/admin.model"
import Employee from "@/lib/models/employee.model";
import { employee } from "@/types/employee.type";
import userAction from "../user/userAction";
import { user } from "@/types/user.type";
import { access } from "@/utils/enum";
import { revalidatePath } from "next/cache";


const createEmployee = async (employeeInfo: employee) => {
    try {
        console.log(employeeInfo)
        await connectToDB()
        // check if admin or employee already exists
        const admin = await Admin.findOne({ phoneNo: employeeInfo.phoneNo })
        if (admin) {
            return {
                success: false,
                status: 403,
                message: "This phone number is already in use",
            }
        }
        const user = await Employee.findOne({ phoneNo: employeeInfo.phoneNo })
        if (user) {
            return {
                success: false,
                status: 403,
                message: "This phone number is already in use",
            }
        }

        // Add a new Employee
        const employee = new Employee({
            name: employeeInfo.name,
            phoneNo: employeeInfo.phoneNo,
            drivingLicenseNo: employeeInfo.drivingLicenseNo,
            gatePassNo: employeeInfo.gatePassNo,
            safetyPassNo: employeeInfo.safetyPassNo,
            aadharNo: employeeInfo?.aadharNo,
            employeeRole: employeeInfo.employeeRole,
            UAN: employeeInfo.UAN,
            bankDetails:employeeInfo.bankDetails
        })
        console.log("wowoowoww", employee)
        var savedEmployee = await employee.save()
        console.log(savedEmployee)
        if (employeeInfo.employeeRole.toUpperCase() === "FLEETMANAGER" || "DRIVER" ||"HR"||"Safety") {
             
            const user: user = {
                employee: employee._id,
                hashedpassword: employeeInfo.phoneNo.toString(),
                access: employeeInfo.employeeRole.toUpperCase() === "DRIVER" ? access.DRIVER : employeeInfo.employeeRole.toUpperCase() === "FLEETMANAGER"?access.FLEET_MANAGER:employeeInfo.employeeRole.toUpperCase() === "HR"?access.HR:access.Safety
            }
            console.log(user)
            const res = await userAction.CREATE.createUser(user)
            console.log("yeic to res hai", res)
            if (res.status != 201) {
                return {
                    success: false,
                    status: res.status,
                    message: res.message,
                    error: res?.error,
                }
            }
        }
        const employeeObject = {
            _id: savedEmployee._id.toString(),
            name: savedEmployee.name,
            phoneNo: savedEmployee.phoneNo,
            drivingLicenseNo: savedEmployee.drivingLicenseNo,
            UAN: savedEmployee.UAN,
            gatePassNo: savedEmployee.gatePassNo,
            safetyPassNo: savedEmployee.safetyPassNo
        }
        revalidatePath('/admin/employees')
        return {
            success: true,
            status: 201,
            message: "Employee added successfully",
            data: employeeObject
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }
}


export { createEmployee };  