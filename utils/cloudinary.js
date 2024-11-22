import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloud = async (localFilePath, folder) => {
  try {
    console.log("uploading file from:", localFilePath);
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: `school-management-system/${folder}`, //dynamic folder (for images teachers and students)
    });
    //file has been uploaded
    console.log("file is uploaded on cloudinary", response.url);
    return response.url;
  } catch (err) {
    fs.unlinkSync(localFilePath); //remove locally saved temp file as the upload operation got failed
    return null;
  }
};

export default uploadOnCloud;
