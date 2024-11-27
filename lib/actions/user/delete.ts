'use server'
import connectToDB from "@/lib/database";
import Admin from "@/lib/models/admin.model";
import User from "@/lib/models/user.model"
import { admin, user } from "@/types/user.type";



const deleteUser = async (userInfo: user) => {
    try {
        await connectToDB()
        var user = await User.deleteOne(userInfo)
        return {
            success: true,
            status: 204,
            message: "User deleted successfully"
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

const deleteAdmin = async (adminInfo: admin) => {
    try {
        await connectToDB()
        var admin = await Admin.deleteOne(adminInfo)
        return {
            success: true,
            status: 204,
            message: "Admin deletes successfully"
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


export { deleteAdmin, deleteUser };  