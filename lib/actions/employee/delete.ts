'use server'
import connectToDB from "@/lib/database";
import Employee from "@/lib/models/employee.model";
import { employee } from "@/types/employee.type";
import { revalidatePath } from "next/cache";

const deleteEmployee = async (employeeInfo: employee) => {
    try {
        await connectToDB()
        var employee = await Employee.deleteOne(employeeInfo)
        revalidatePath('/admin/employees')

        return {
            success: true,
            status: 201,
            message: "Employee deleted sucessfully",
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }
}


export { deleteEmployee };  