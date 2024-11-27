'use server'
import connectToDB from "@/lib/database";
import Admin from "@/lib/models/admin.model";
import User from "@/lib/models/user.model"
import { admin, user } from "@/types/user.type";



const getUser = async (userInfo: user) => {
    try {
        await connectToDB()
        var user = await User.findOne(userInfo)
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }

    if (!user) {
        return {
            success: false,
            status: 404,
            message: "User not found",
        }
    }
    return {
        success: true,
        status: 200,
        message: "Admin found",
        data: user
    }
}

const getAdmin = async (adminInfo: admin) => {
    try {
        await connectToDB()
        var admin = await Admin.findOne(adminInfo)
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }
    if (!admin) {
        return {
            success: false,
            status: 404,
            message: "Admin not found",
        }
    }
    return {
        success: true,
        status: 200,
        message: "Admin found",
        data: admin
    }
}



export { getUser, getAdmin }; 