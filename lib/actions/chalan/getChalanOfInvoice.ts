'use server'

import connectToDB from "@/lib/database"
import Invoice from "@/lib/models/invoice.model";
import Chalan from "@/lib/models/chalan.model";

const getPhysicalChalansOfInvoice = async (invoiceNumber: string, createdAt: any) => {
    try {
        await connectToDB();
        const invoice = await Invoice.findOne({
            invoiceNumber: invoiceNumber,
            createdAt: createdAt
        }).exec();
        if (!invoice) {
            return {
                success: false,
                status: 404,
                message: 'Invoice not found'
            };
        }
        const chalansArr = invoice.chalans;
        console.log(chalansArr);
        const chalansPromises = chalansArr.map(async (ele) => {
            const chalan = await Chalan.findOne({ chalanNumber: ele }).exec(); // Add exec() to ensure the query is executed
            return {chalanNumber:chalan?.chalanNumber,file:chalan?.file}; // Return the file property
        });
        const res = await Promise.all(chalansPromises);
        return {
            success: true,
            status: 200,
            message: 'Physical Chalans Fetched',
            data: JSON.stringify(res)
        };
    } catch (err) {
        console.error('Error fetching chalans:', err);
        return {
            success: false,
            status: 500,
            message: 'Internal Server Error'
        };
    }
};


export {getPhysicalChalansOfInvoice}