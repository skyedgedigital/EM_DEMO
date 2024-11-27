'use server'
import connectToDB from "@/lib/database";
import User from "@/lib/models/user.model"
import { user } from "@/types/user.type";
import { genSaltSync, hashSync } from "bcrypt-ts";


const updateUserPassword = async (user_id: string, password:string) => {
    try {
        await connectToDB()
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        var user = await User.updateOne({ _id: user_id }, { hashedpassword: hash });
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server Error",
            error: JSON.stringify(error),
        }
    }

    return {
        success: true,
        status: 204,
        message: "Password Updated Successfully",
    }
}

export { updateUserPassword }; 