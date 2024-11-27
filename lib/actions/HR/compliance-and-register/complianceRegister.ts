"use server";

import connectToDB from "@/lib/database";
import EmployeeData from "@/lib/models/HR/EmployeeData.model";

// CREATE

// Add an entry to Damage Register
const addEmployeeToDamageRegister = async (dataString: string) => {
    try {
        await connectToDB();
        const dataObj = JSON.parse(dataString);

        const { employeeId, damageEntry } = dataObj; // Assume dataObj contains employeeId and the damage register entry
        const employee = await EmployeeData.findById(employeeId);

        if (!employee) {
            return {
                success: false,
                status: 404,
                message: "Employee not found",
            };
        }

        employee.damageRegister.push(damageEntry); // Add the new damage entry
        await employee.save();

        return {
            success: true,
            status: 200,
            message: "Damage register updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: JSON.stringify(error),
        };
    }
};

// Add an entry to Advance Register
const addEmployeeToAdvanceRegister = async (dataString: string) => {
    try {
        await connectToDB();
        const dataObj = JSON.parse(dataString);

        const { employeeId, advanceEntry } = dataObj; // Assume dataObj contains employeeId and the advance register entry
        const employee = await EmployeeData.findById(employeeId);

        if (!employee) {
            return {
                success: false,
                status: 404,
                message: "Employee not found",
            };
        }

        employee.advanceRegister.push(advanceEntry); // Add the new advance entry
        await employee.save();

        return {
            success: true,
            status: 200,
            message: "Advance register updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: JSON.stringify(error),
        };
    }
};

// FETCH

// Fetch all Damage Register entries within a date range
const fetchDamageRegister = async (fromDate: string, toDate: string) => {
    try {
        // Connect to the database
        await connectToDB();

        // Parse the date range
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include the entire "to" day

        // Fetch employees with the required fields
        const employees = await EmployeeData.find({}, "name damageRegister")
            .populate("designation")
            .lean();

        // Process the data
        const data = employees.flatMap(employee =>
            (employee.damageRegister || []) // Safeguard if damageRegister is undefined
                .filter(entry => {
                    const entryDate = new Date(entry.dateOfDamageOrLoss);
                    return entryDate >= from && entryDate <= to;
                })
                .map(entry => ({
                    employeeName: employee.name, // Add employee name to each entry
                    designation: employee.designation.designation,
                    fatherorhusband: employee.fathersName || "NA",
                    ...entry,
                }))
        );

        // Return success response
        return {
            success: true,
            status: 200,
            message: "Damage Register Retrived Succesfully!",
            data: JSON.stringify(data),
        };
    } catch (error) {
        // Catch and return detailed error information
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: error.message || JSON.stringify(error),
        };
    }
};

// Fetch all Advance Register entries within a date range
const fetchAdvanceRegister = async (fromDate: string, toDate: string) => {
    try {
        // Connect to the database
        await connectToDB();

        // Parse the date range
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include the entire "to" day

        // Fetch employees with the required fields
        const employees = await EmployeeData.find({}, "name advanceRegister")
            .populate("designation")
            .lean();

        // Process the data
        const data = employees.flatMap(employee =>
            (employee.advanceRegister || []) // Safeguard if advanceRegister is undefined
                // .filter(entry => {
                //     const entryDate = new Date(entry.dateOfAdvanceGiven);
                //     return entryDate >= from && entryDate <= to;
                // })
                .map(entry => ({
                    employeeName: employee.name,
                    designation: employee.designation.designation,
                    fatherorhusband: employee.fathersName,
                    ...entry,
                }))
        );

        const filterData = data.filter(entry => {
            const entryDate = new Date(entry.dateOfAdvanceGiven);
            return !isNaN(entryDate.getTime()) && entryDate >= from && entryDate <= to;
        });

        // Return success response
        return {
            success: true,
            status: 200,
            message: "Advance Register Retrived Succesfully!",
            data: JSON.stringify(filterData),
        };
    } catch (error) {
        // Catch and return detailed error information
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: error.message || JSON.stringify(error),
        };
    }
};

// Fetch Advance and Damage Register for a Specific Employee by ID
const fetchEmployeeRegisterById = async (employeeId: string) => {
    try {
        // Connect to the database
        await connectToDB();

        // Fetch employee data
        const employee = await EmployeeData.findById(
            employeeId,
            "name fathersName designation damageRegister advanceRegister"
        )
            .populate("designation") // Include designation details
            .lean();

        // Check if employee exists
        if (!employee) {
            return {
                success: false,
                status: 404,
                message: "Employee not found",
            };
        }

        // Prepare the response
        const response = {
            employeeName: employee.name,
            designation: employee.designation?.designation || "NA",
            fatherorhusband: employee.fathersName || "NA",
            damageRegister: employee.damageRegister || [],
            advanceRegister: employee.advanceRegister || [],
        };

        // Return success response
        return {
            success: true,
            status: 200,
            message: "Employee Advance and Damage Register Retrieved Successfully",
            data: JSON.stringify(response),
        };
    } catch (error) {
        // Handle server errors
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: error.message || JSON.stringify(error),
        };
    }
};


// Update a specific entry in the Damage Register
const updateDamageRegisterEntry = async (employeeId: string, entryId: string, updatedData: any) => {
    try {
        await connectToDB();

        const employee = await EmployeeData.findById(employeeId);
        if (!employee) {
            return {
                success: false,
                status: 404,
                message: "Employee not found",
            };
        }

        const entry = employee.damageRegister.id(entryId); // Find the specific entry
        if (!entry) {
            return {
                success: false,
                status: 404,
                message: "Damage register entry not found",
            };
        }

        Object.assign(entry, updatedData); // Update the entry
        await employee.save();

        return {
            success: true,
            status: 200,
            message: "Damage register entry updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: JSON.stringify(error),
        };
    }
};

// Update a specific entry in the Advance Register
const updateAdvanceRegisterEntry = async (employeeId: string, entryId: string, updatedData: any) => {
    try {
        await connectToDB();

        const employee = await EmployeeData.findById(employeeId);
        if (!employee) {
            return {
                success: false,
                status: 404,
                message: "Employee not found",
            };
        }

        const entry = employee.advanceRegister.id(entryId); // Find the specific entry
        if (!entry) {
            return {
                success: false,
                status: 404,
                message: "Advance register entry not found",
            };
        }

        Object.assign(entry, updatedData); // Update the entry
        await employee.save();

        return {
            success: true,
            status: 200,
            message: "Advance register entry updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: JSON.stringify(error),
        };
    }
};

const updateDamageInstallment = async (employeeId, damageId) => {
    try {
        // Retrieve the employee's record
        const employee = await EmployeeData.findOne({ _id: employeeId });

        if (!employee) {
            throw new Error(`Employee with ID ${employeeId} not found`);
        }

        // Find the damage entry in the damageRegister array
        const damageEntry = employee.damageRegister.find(entry => entry._id.toString() === damageId);

        if (!damageEntry) {
            throw new Error(`Damage entry with ID ${damageId} not found`);
        }

        if (damageEntry.installmentsLeft <= 0) {
            throw new Error(`No installments left for this damage entry`);
        }

        // Decrement installmentsLeft by 1
        damageEntry.installmentsLeft -= 1;

        // Save the updated employee record
        await employee.save();

        console.log("Damage installment updated successfully:", damageEntry);
        return {
            success: true,
            data: damageEntry,
            message: "Damage installment updated successfully",
        };
    } catch (error) {
        console.error("Error updating damage installment:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

const updateAdvanceInstallment = async (employeeId, advanceId) => {
    try {
        // Retrieve the employee's record
        const employee = await EmployeeData.findOne({ _id: employeeId });

        if (!employee) {
            throw new Error(`Employee with ID ${employeeId} not found`);
        }

        // Find the advance entry in the advanceRegister array
        const advanceEntry = employee.advanceRegister.find(entry => entry._id.toString() === advanceId);

        if (!advanceEntry) {
            throw new Error(`Advance entry with ID ${advanceId} not found`);
        }

        if (advanceEntry.installmentsLeft <= 0) {
            throw new Error(`No installments left for this advance entry`);
        }

        // Decrement installmentsLeft by 1
        advanceEntry.installmentsLeft -= 1;

        // Save the updated employee record
        await employee.save();

        console.log("Advance installment updated successfully:", advanceEntry);
        return {
            success: true,
            data: advanceEntry,
            message: "Advance installment updated successfully",
        };
    } catch (error) {
        console.error("Error updating advance installment:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

export {
    addEmployeeToDamageRegister,
    addEmployeeToAdvanceRegister,
    fetchDamageRegister,
    fetchAdvanceRegister,
    updateDamageRegisterEntry,
    updateDamageInstallment,
    updateAdvanceInstallment,
    updateAdvanceRegisterEntry,
    fetchEmployeeRegisterById
};
