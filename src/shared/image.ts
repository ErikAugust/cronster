import {v2 as cloudinary} from 'cloudinary';

require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function uploadDataUrl(dataUrl: string) {
  if (!dataUrl) throw new Error('No Data URL provided');

  return await cloudinary.uploader.upload(dataUrl);
}