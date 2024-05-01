import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import {CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} from '../config.js'





// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// import {v2 as cloudinary} from 'cloudinary';

// cloudinary.config({ 
//   cloud_name: 'db36fxigb', 
//   api_key: '325851191632844', 
//   api_secret: '***************************' 
// });


const uploadOnCloudinary = async (localFilePath) => {
    console.log('CLOUDINARY_CLOUD_NAME:', CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY:', CLOUDINARY_API_KEY);
    console.log('CLOUDINARY_API_SECRET:', CLOUDINARY_API_SECRET);
    try {
        console.log("In if upload on cloudinary")
        if (!localFilePath) return null
        const uploadOptions = {
            resource_type: 'auto',
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
          };
        console.log("In cloudinary filepath", localFilePath)

        //         cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
        //   { public_id: "olympic_flag" }, 
        //   function(error, result) {console.log("result",result); });

        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, uploadOptions)
        console.log("FIle uploaded on cloudinary: " + cloudinaryResponse.url)
        fs.unlink(localFilePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            }
        })
        return cloudinaryResponse.url
       
    }
    catch (err) {
        console.log("Goin in  catch of cloudinary", err)
        fs.unlink(localFilePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            }
        })
        return null
    }
}

export { uploadOnCloudinary }