'use server'
import connectToDB from "@/lib/database"
import Chalan from "@/lib/models/chalan.model";
import Department from "@/lib/models/department.model";
import Engineer from "@/lib/models/engineer.model";
import WorkOrder from "@/lib/models/workOrder.model";
import mongoose from "mongoose";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from "@/utils/aws";
import { fn } from "./calculatePrice";
import { getStorage,ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import { storage,app } from "@/utils/fireBase/config";
// import { initializeApp } from "firebase/app";
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);


async function uploadFileToS3(file: any, fileName: any) {
    const key: string = `chalans/${fileName}.jpg`;
    const fileBuffer = file;
    console.log(fileBuffer)
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpg',
    };
  
    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      console.log("yezzur",key)
      return `${key}`;
    } catch (error) {
      return null;
    }
  }


  const uploadFile = (storageRef, file) => {
    return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error('Upload failed:', error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

const createChalan = async(chalanData:FormData) => {
    try{
        await connectToDB();
        console.log(chalanData)
        const file=chalanData.get('file');
        console.log(file)
        const tempChalanDetails=chalanData.get('chalanDetails')
        const {   workOrder,
            department,
            location,
            workDescription,
            items,
            chalanNumber,
            engineer,
            date,
            signed,
            commentByDriver,
        commentByFleetManager}=await JSON.parse(tempChalanDetails as string)
        console.log(workOrder)
   
        if (file instanceof File) {

            const fileName = file.name; // Get the file name
        const storageRef = ref(storage, `images/${chalanNumber}/${fileName}`); // Create a reference in Firebase Storage

        const downloadURL =await uploadFile(storageRef, file);


        
        
          const existingWorkOrderId=await WorkOrder.findOne({workOrderNumber:workOrder})
          const workOrderId=existingWorkOrderId._id
          const existingDepartment=await Department.findOne({departmentName:department})
          const departmentId=existingDepartment._id
          const existingEngineer=await Engineer.findOne({name:engineer})
          const engineerId=existingEngineer._id
          const obj = new Chalan({
          
            location,
            workDescription,
            chalanNumber,
        
            date,
            signed,
            commentByDriver,
        commentByFleetManager,
        
            workOrder:new mongoose.Types.ObjectId(workOrderId),
            department:new mongoose.Types.ObjectId(departmentId),
            engineer:new mongoose.Types.ObjectId(engineerId),
            file: downloadURL,
            items:[]
        })
        console.log("The obj to be saved",obj);
        const resp = await obj.save();
        const objId = resp._id;
        const result = await Chalan.findOneAndUpdate(
            {
                _id:objId
            },
            {
                $push:{items:items}
            },
            {
                new:true
            }
        )
        const chalanId = result._id;
        const updatedResult = await fn(chalanId)
        console.log(updatedResult);
        return{
            success:true,
            status:200,
            data:JSON.stringify(result),
            message: "Chalan created successfully"
        }

        } else {
          console.error('Unexpected data type for file:', file);

          return{
            success:false,
            status:500,
            message:'Unexpected data type for file:',
           
        }
        }    
      
        
    }
    catch(err){
        console.log(err)
        return{
            success:false,
            status:500,
            message:'Internal Server Error',
            error: err.message || 'An unknown Error occurred'
        }
    }
}

export {createChalan}