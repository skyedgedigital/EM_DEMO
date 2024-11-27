'use server'
import { EmployeeDataSchema } from '@/lib/models/HR/EmployeeData.model';
import { EmployeeData } from './../../../components/hr/WagesColumn';


import connectToDB from "@/lib/database"
import Chemical, { ChemicalSchema } from "@/lib/models/safetyPanel/chemicals/chemical.model";
import ChemicalIssue from "@/lib/models/safetyPanel/chemicals/chemicalIssue.model";
import mongoose from "mongoose";

const ChemicalModel = mongoose.models.Chemical || mongoose.model("Chemical",ChemicalSchema);
const EmployeeModel = mongoose.models.EmployeeData || mongoose.model("EmployeeData",EmployeeDataSchema)
const createChemicalIssue = async(dataString:string) => {
    try{
        await connectToDB();
        const dataObj = JSON.parse(dataString);
        const docObj = new ChemicalIssue({
            ...dataObj
        });
        const chemicalId = dataObj.chemicalId;
        const quantityIssued = dataObj.quantity;
        const chemicalDetails = await Chemical.findOne({
            _id:chemicalId
        })
        const existingQuantity = chemicalDetails.quantity
        const updatedChemical = await Chemical.findOneAndUpdate(
            {
                _id:chemicalId
            },
            {
                $set:{
                    quantity:existingQuantity-quantityIssued
                }
            },
            {
                new:true
            }
        )
        console.log(updatedChemical)
        const result = await docObj.save();
        return{
            success:true,
            message:'Chemical Issue Added',
            status:200,
            data:JSON.stringify(result)
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

const deleteChemicalIssue = async(chemicalIssueId:any) => {
    try{
        await connectToDB();
        const chemicalIssueDetails = await ChemicalIssue.findOne({
            _id:chemicalIssueId
        })
        const chemicalId = chemicalIssueDetails.chemicalId;
        const quantityIssued = chemicalIssueDetails.quantity;
        const chemicalDetails = await Chemical.findOne({
            _id:chemicalId
        })
        const existingQuantity = chemicalDetails.quantity
        const updatedChemicalDetails = await Chemical.findOneAndUpdate(
            {
                _id:chemicalId
            },
            {
                $set:{
                    quantity:existingQuantity+quantityIssued
                }
            }
        )
        console.log(updatedChemicalDetails)
        const result = await ChemicalIssue.deleteOne({_id:chemicalIssueId});
        return{
            success:true,
            message:'Compliance Added',
            status:200,
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

const fetchChemicalIssues = async() => {
    try{
        await connectToDB();
        const chemicals = await ChemicalIssue.find({}).populate("chemicalId","name").populate("issuedTo","name");
        return{
            success:true,
            status:200,
            message:'List of All Chemical Issues',
            data:JSON.stringify(chemicals)
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

const fetchChemicalIssueById = async(chemicalIssueId:any) => {
    try{
        await connectToDB();
        const chemicals = await ChemicalIssue.findOne({
            _id:chemicalIssueId
        });
        return{
            success:true,
            status:200,
            message:'List of All Chemical Issues',
            data:JSON.stringify(chemicals)
        }
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            err:JSON.stringify(err)
        }
    }
}

export {createChemicalIssue,deleteChemicalIssue,fetchChemicalIssueById,fetchChemicalIssues}