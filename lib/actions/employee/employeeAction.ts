import { createEmployee } from "./create"
import { deleteEmployee } from "./delete"
import { getEmployee, fetchAllEmployees, fetchEmpByPhoneNumber } from "./fetch"

const employeeAction = {
    CREATE: {
        createEmployee: createEmployee
    },
    FETCH: {
        getEmployee: getEmployee,
        fetchAllEmployees:fetchAllEmployees,
        fetchEmployeeByPhoneNumber:fetchEmpByPhoneNumber
    },
    DELETE: {
        deleteEmployee: deleteEmployee,
    }
}

export default employeeAction