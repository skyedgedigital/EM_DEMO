import mongoose, { Schema } from "mongoose";

interface IWorkOrderHr {
    workOrderNumber: string;
    date: string;
    jobDesc: string;
    orderDesc: string;
    dept: string;
    section: string;
    validFrom: string;
    validTo: string;
    bonusRate?: number;
    StateDetails: IState;
}

interface IState {
    stateName: string;
    stateAddress?: string;
    statePayRate: number;
}
const StateSchema: mongoose.Schema<IState> = new Schema({
    stateName: {
        type: String,
        required: true
    },
    stateAddress: {
        type: String,
    },
})

const WorkOrderHrSchema: mongoose.Schema<IWorkOrderHr> = new Schema({
    workOrderNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    jobDesc: {
        type: String,
    },
    orderDesc: {
        type: String,
    },
    dept: {
        type: String,
    },
    section: {
        type: String,
    },
    validFrom: {
        type: String
    },
    validTo: {
        type: String
    },
    bonusRate: {
        type: Number,
        default: 0,
    },
    StateDetails: StateSchema

})

const WorkOrderHr: mongoose.Model<IWorkOrderHr> = mongoose.models.WorkOrderHr || mongoose.model("WorkOrderHr", WorkOrderHrSchema)
export { WorkOrderHrSchema }
export default WorkOrderHr