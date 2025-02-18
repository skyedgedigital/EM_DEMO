import { Session } from 'next-auth';
import { access } from './utils/enum';

declare module 'next-auth' {
    interface Session {
        user: employee | admin;
    }
    interface employee {
        _id: string;
        access: access,
        name: string;
        phoneNo: number;
        drivingLicenseNo: string;
        gatePassNo: string;
        safetyPassNo: string;
        UAN: number;
        aadharNo: number;
        bankDetails: IBankDetails;
        employeeRole: String;
    }
    interface admin {
        phoneNo: number;
        access: "ADMIN";
        name: string;
        _id: string;
    }
}
