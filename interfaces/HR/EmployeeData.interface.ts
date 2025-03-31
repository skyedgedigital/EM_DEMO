import { IDesignation } from '@/lib/models/HR/designation.model';
import mongoose, { PopulatedDoc } from 'mongoose';
import { Document } from 'mongoose';

export interface IDamageRegister extends Document{
  particularsOfDamageOrLoss: string;
  dateOfDamageOrLoss: Date;
  personWhoHeardExplanation: string;
  remarks: string;
  amountOfDeductionImposed: number;
  numberOfInstallments: number;
  installmentsLeft: number;
  didWorkmanShowCause: boolean;
}
export interface IAdvanceRegister extends Document {
  amountOfAdvanceGiven: number;
  remarks: string;
  numberOfInstallments: number;
  installmentsLeft: number;
  dateOfAdvanceGiven: Date;
  purposeOfAdvanceGiven: string;
}
export interface IEmployeeData extends Document {
  // employeeDetails:{
  code: string;
  workManNo: string;
  name: string;
  department: mongoose.Schema.Types.ObjectId;
  site: mongoose.Schema.Types.ObjectId;
  designation: PopulatedDoc<IDesignation>;
  bank: mongoose.Schema.Types.ObjectId;
  accountNumber: string;
  pfApplicable: boolean;
  pfNo: string;
  UAN: string;
  ESICApplicable: boolean;
  ESICNo: string;
  ESILocation: mongoose.Schema.Types.ObjectId;
  adhaarNumber: string;
  // },
  workOrderHr: {
    period: string;
    workOrderHr: mongoose.Types.ObjectId;
    workOrderAtten: number;
  }[];
  // personalInformation:{
  sex: 'Male' | 'Female' | 'TransGender';
  martialStatus: 'married' | 'unmarried' | 'choose to not disclose';
  dob: string;
  attendanceAllowance: boolean;
  fathersName: string;
  address: string;
  landlineNumber: string;
  mobileNumber: string;
  workingStatus: boolean;
  appointmentDate: string;
  resignDate: string;
  // },
  // otherDetails:{
  safetyPassNumber: string;
  SpValidity: string;
  policeVerificationValidityDate: string;
  gatePassNumber: string;
  gatePassValidTill: string;
  maritalStatus?: string;
  bonus: {
    year: number;
    status: boolean;
  };
  leave: {
    year: number;
    status: boolean;
  };
  basic: string;
  DA: string;
  CA: string;
  HRA: string;
  food: string;
  incentives: string;
  uniform: string;
  medical: string;
  loan: string;
  LIC: string;
  oldBasic: string;
  oldDA: string;
  damageRegister: IDamageRegister[];
  advanceRegister: IAdvanceRegister[];
  profilePhotoURL: string;
  drivingLicenseURL: string;
  aadharCardURL: string;
  bankPassbookURL: string;
}
