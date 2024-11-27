'use server';

import connectToDB from '@/lib/database';
import EmployeeData from '@/lib/models/HR/EmployeeData.model';
import { storage } from '@/utils/fireBase/config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const createEmployeeData = async (dataString: string) => {
  try {
    await connectToDB();

    const dataObj = JSON.parse(dataString);
    const exist = await EmployeeData.findOne({ code: dataObj.code });
    console.log('oooooooo', exist);
    if (exist) {
      return {
        success: false,
        message: 'Code already exits',
      };
    }
    const startYear = new Date(dataObj.appointmentDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const bonusLeaveData = [];

    for (let year = startYear; year <= currentYear; year++) {
      bonusLeaveData.push({ year, status: false });
    }

    const Obj = new EmployeeData({
      ...dataObj,
      bonus: bonusLeaveData,
      leave: bonusLeaveData,
    });
    const resp = await Obj.save();

    return {
      success: true,
      message: 'Employee Data Created Successfully',
      data: JSON.stringify(resp),
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      status: 500,
    };
  }
};

const createEmployeeDataBulk = async (dataString: string) => {
  try {
    await connectToDB();
    const dataArray = JSON.parse(dataString);
    const resp = await EmployeeData.insertMany(dataArray);
    return {
      success: true,
      message: 'Employee Data Created Successfully',
      data: JSON.stringify(resp),
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      status: 500,
    };
  }
};

// Function to upload a file to Firebase Storage
const uploadFile = (storageRef, file) => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload task

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Monitor the upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle upload errors
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        // Handle successful uploads
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Get the download URL
          console.log('File available at', downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        } catch (error) {
          reject(error); // Reject the promise if there's an error
        }
      }
    );
  });
};
const uploadEmployeeDataPhotos = async (photosData: FormData) => {
  try {
    // Extract files from FormData
    const driverLicense = photosData.get('driverLicense');
    const aadharCard = photosData.get('aadharCard');
    const bankPassbook = photosData.get('bankPassbook');
    const profilePhoto = photosData.get('profilePhoto');
    const employeeCode = photosData.get('code');

    const updateblelURLs = {
      profilePhotoURL: '',
      drivingLicense: '',
      aadharCard: '',
      bankPassbook: '',
    };
    if (driverLicense instanceof File) {
      const fileName = driverLicense.name; // Get the file name
      const storageRef = ref(
        storage,
        `images/${employeeCode}/Driving_License_${fileName}`
      ); // Create a reference in Firebase Storage
      const DLdownloadURL = await uploadFile(storageRef, driverLicense);
      console.log('Driving License URL', DLdownloadURL);
      //   console.log('TYPE OF', typeof DLdownloadURL);
      if (DLdownloadURL) {
        updateblelURLs.drivingLicense = DLdownloadURL as string;
      }
    }
    if (aadharCard instanceof File) {
      const fileName = aadharCard.name; // Get the file name
      const storageRef = ref(
        storage,
        `images/${employeeCode}/Aadhar_Card_${fileName}`
      ); // Create a reference in Firebase Storage
      const ACdownloadURL = await uploadFile(storageRef, aadharCard);
      console.log('AAdhar URL', ACdownloadURL);
      if (ACdownloadURL) {
        updateblelURLs.aadharCard = ACdownloadURL as string;
      }
    }
    if (bankPassbook instanceof File) {
      const fileName = bankPassbook.name; // Get the file name
      const storageRef = ref(
        storage,
        `images/${employeeCode}/Bank_Passbook_${fileName}`
      ); // Create a reference in Firebase Storage
      const BPdownloadURL = await uploadFile(storageRef, bankPassbook);
      console.log('Bank Passbook URL', BPdownloadURL);
      if (BPdownloadURL) {
        updateblelURLs.bankPassbook = BPdownloadURL as string;
      }
    }
    if (profilePhoto instanceof File) {
      const fileName = profilePhoto.name; // Get the file name
      const storageRef = ref(
        storage,
        `images/${employeeCode}/Profile_Photo_${fileName}`
      ); // Create a reference in Firebase Storage
      const PPdownloadURL = await uploadFile(storageRef, profilePhoto);
      console.log('Profile URL', PPdownloadURL);
      if (PPdownloadURL) {
        updateblelURLs.profilePhotoURL = PPdownloadURL as string;
      }
    }

    // updating photo urls in EmployeeData

    const res = await EmployeeData.findOneAndUpdate(
      { code: employeeCode },
      {
        $set: updateblelURLs,
      },
      { new: true }
    );
    return {
      success: true,
      message: 'Photos uploaded successfully',
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Error uploading photos',
      error: JSON.stringify(err),
      status: 500,
    };
  }
};

export { createEmployeeData, createEmployeeDataBulk, uploadEmployeeDataPhotos };
