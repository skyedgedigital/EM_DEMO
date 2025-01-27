import { storage } from '@/utils/fireBase/config';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUpload, FaSpinner, FaTrash } from 'react-icons/fa6';

interface SinglePDFUploadProps {
  documentType: string;
  onUpload: (uploadedDocumentInfo: {
    documentType: string;
    fileUrl: string;
    category?: string;
  }) => Promise<void>;
  onDelete?: () => void;
  initialFileUrl?: string | null;
  documentCategory?: string;
}

const SinglePDFUpload: React.FC<SinglePDFUploadProps> = ({
  documentType,
  onUpload,
  onDelete,
  initialFileUrl = null,
  documentCategory,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(initialFileUrl);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); // Create a preview URL
    } else {
      toast.error('Please upload a valid PDF file.');
    }
  };
  /**
   * Handles the upload of a user-selected PDF file to Firebase Storage.
   * @param file - The selected PDF file.
   * @param storagePath - The Firebase Storage path (e.g., 'invoices/').
   * @param fileName - The name of the PDF file.
   * @returns The download URL of the uploaded PDF.
   */
  const handlePDFUpload = async (
    file: File,
    storagePath: string,
    fileName: string
  ): Promise<string> => {
    try {
      // Step 1: Convert the file to a Blob
      const blob = new Blob([file], { type: file.type });

      // Step 2: Upload the Blob to Firebase Storage
      const storageRef = ref(storage, `${storagePath}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Error uploading PDF to Firebase:', error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });

      toast.success('PDF uploaded successfully!');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF. Please try again.');
      throw error;
    }
  };
  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    try {
      setUploading(true);

      const docName = documentType.toLowerCase().split(' ').join('-');
      // Step 1: Upload the PDF to Firebase Storage
      const downloadURL = await handlePDFUpload(
        file,
        'safety-management-documents', // Firebase Storage path
        `${docName}.pdf` // Unique file name
      );

      // Step 2: Call the onUpload callback with the download URL
      await onUpload({
        documentType: docName,
        fileUrl: downloadURL,
        category: documentCategory,
      });

      toast.success(`${documentType} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${documentType}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setFileUrl(null);
    if (onDelete) onDelete();
    toast.success(`${documentType} deleted successfully!`);
  };

  return (
    <div className='rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
      <h2 className='text-lg font-semibold capitalize mb-4'>{documentType}</h2>
      <div className='flex flex-col items-center gap-4'>
        {fileUrl ? (
          <iframe
            src={fileUrl}
            className='border rounded min-h-[800px] w-full'
            title={`${documentType} Preview`}
          />
        ) : (
          <p className='text-gray-500'>No PDF selected for preview</p>
        )}
      </div>
      <div className='flex justify-center items-center gap-2 mt-4'>
        <input
          type='file'
          accept='application/pdf'
          onChange={handleFileChange}
          className='border p-2 rounded'
        />
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2'
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <FaSpinner className='animate-spin' /> : <FaUpload />}
          Upload
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2'
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SinglePDFUpload;
