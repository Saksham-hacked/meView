import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
      if(!localfilepath) return null;
      const response = await cloudinary.uploader.upload(localfilepath, {
        resource_type: "auto",
      });
      console.log("file uploaded to cloudinary", response.secure_url);
      fs.unlinkSync(localfilepath);
      return response;

    
  } catch (error) {
    fs.unlinkSync(localfilepath);
    console.log("Error uploading file to cloudinary", error);
  }  
}

export { uploadOnCloudinary}

