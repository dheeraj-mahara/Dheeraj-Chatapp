    //    -==-=-==--= cloudinery work -=-=-=-==--====--==
    import cloudinary from "../config/cloudinary.js";

    export const uploadeImage = (file ,folder)=>{
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image"
                },
                (error,result)=>{
                    if (error) reject(error)
                    else resolve(result.secure_url) 
                }
            ).end(file.buffer)
        })
    }