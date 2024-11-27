'use server'
import connectToDB from "@/lib/database";
import Admin from "@/lib/models/admin.model"
import User from "@/lib/models/user.model";
import { admin, user } from "@/types/user.type";
import { genSaltSync, hashSync } from "bcrypt-ts";

const createAdmin = async (adminInfo: admin) => {
    /*
        Default Admin Data:
        adminInfo = {
            name: "Admin",
            hashedpassword: hashSync("admin", genSaltSync(10)),
            phoneNo: 1234567890,
            access: "ADMIN"
        }
    */
    try {
        await connectToDB()
        const salt = genSaltSync(10);
        const hash = hashSync(adminInfo.hashedpassword, salt);
        var admin = new Admin({
            name: adminInfo.name,
            hashedpassword: hash,
            phoneNo: adminInfo.phoneNo,
        })
        var savedAdmin = await admin.save()
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }
    
    const adminObject = {
        _id: savedAdmin._id.toString(),
        name: savedAdmin.name,
        phoneNo: savedAdmin.phoneNo,
        access: savedAdmin.access
    }

    return {
        success: true,
        status: 201,
        message: "Admin Created",
        data: adminObject
    }
}

const createUser = async (userInfo: user) => {
    try {
        console.log("owowowoowow", userInfo)
        await connectToDB()
        const salt = genSaltSync(10);
        const hash = hashSync(userInfo.hashedpassword, salt);
        const user = new User({
            employee: userInfo.employee,
            hashedpassword: hash,
            access: userInfo.access
        })
    
        var savedUser = await user.save()
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }

    const userObject = {
        _id: savedUser._id.toString(),
        employee: savedUser.employee,
        access: savedUser.access
    }

    return {
        success: true,
        status: 201,
        message: "New user created",
        data: userObject
    }
}

export { createAdmin, createUser };