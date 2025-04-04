import mongoose from 'mongoose';
export interface IEnterpriseBase {
  name: string;
  pan: string;
  gstin: string;
  vendorCode: string;
  // createdAt: Date;
  // updatedAt: Date;
  address: string;
  email: string;
}
export interface IEnterprise extends IEnterpriseBase, mongoose.Document {}
