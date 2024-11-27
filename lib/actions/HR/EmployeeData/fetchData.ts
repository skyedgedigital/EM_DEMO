'use server'

import connectToDB from "@/lib/database";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

const fetchEmpNames = async (page = 0, limit = 20) => {
    try {
        await connectToDB();
        const resp = await EmployeeData.find({})
            .select('name')
            .skip(page * limit)
            .limit(limit); // Fetch a limited number of records with pagination
        return {
            success: true,
            data: JSON.stringify(resp),
            status: 200,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error',
        };
    }
};
export {fetchEmpNames}