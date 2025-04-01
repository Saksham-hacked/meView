import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


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
      fs.unlink(localfilepath, (err) => {
        if (err) console.error("Error deleting file:", err);
    });
    
      return response;

    
  } catch (error) {
    fs.unlink(localfilepath, (err) => {
      if (err) console.error("Error deleting file:", err);
  });
    console.log("Error uploading file to cloudinary", error);
  }  
}

export { uploadOnCloudinary}

