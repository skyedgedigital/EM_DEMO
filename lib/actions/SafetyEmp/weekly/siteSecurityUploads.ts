'use server'

import connectToDB from "@/lib/database";
import SiteSecurityUploads from "@/lib/models/safetyPanel/emp/weekly/siteSecurityUploads.model";

const genSiteSecurityUploads = async(dataString:string) => {
    try{
        await connectToDB();
        const data = JSON.parse(dataString);
        const docObj = new SiteSecurityUploads({
            ...data
        })
        const resp = await docObj.save();
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk created successfully",
            status:200
        }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

const deleteSiteSecurityUploads = async(id:any) => {
    try{
        await connectToDB();
        const resp = await SiteSecurityUploads.findByIdAndDelete(id);
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk deleted successfully",
            status:200
            }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

const fetchSiteSecurityUploads = async() => {
    try{
        await connectToDB();
        const resp = await SiteSecurityUploads.find({}).sort({
            createdAt:-1
        });
        return{
            success:true,
            data:JSON.stringify(resp),
            message:"Tool Box Talk fetched successfully",
            status:200
            }
    }
    catch(err){
        return{
            success:false,
            status:500,
            message:'An Error Occurred'
        }
    }
}

export {genSiteSecurityUploads,fetchSiteSecurityUploads,deleteSiteSecurityUploads}