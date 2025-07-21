import multer from 'multer'
import sharp from 'sharp'
import s3 from '../utils/aws-config.js'
import { v4 as uuidv4 } from 'uuid';


const storage = multer.memoryStorage()
const fileFilter = (req,file,cb)=>{
    const allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp']
    if(allowedTypes.includes(file.mimetype)) cb (null,true)
    else cb(new Error('Only JPEG WEBP and PNG images are allowed'))
}

const upload = multer({storage,fileFilter})


export const uploadImage = [
    upload.single('image'),
    async(req,res)=>{
        console.log("SecretID",process.env.AWS_S3_ACCESS_KEY,process.env.AWS_S3_SECRET_ACCESS_KEY,process.env.AWS_S3_REGION)
        try {
            const file = req.file
            if(!file) return res.status(400).json({success:false,message:"No file uploaded"})

            let quality = 80
            let processedImage
            do{
                processedImage =await sharp(file.buffer).resize(800).jpeg({quality}).toBuffer();
                quality -= 10
            }while(processedImage.length > 2*1024*1024 && quality >= 30)
                const fileKey = `images/${uuidv4()}.jpeg`
                const result = await s3.upload({
                    Bucket:process.env.AWS_S3_BUCKET_NAME,
                    Key:fileKey,
                    Body:processedImage,
                    ContentType:'image/jpeg',
                    // ACL:'public-read'
                }).promise()
                res.status(200).json({
                    success:true,
                    message:'Image uploaded successfully',
                    url:result.Location
                })
        } catch (error) {
            res.status(500).json({success:false,message:'Something went wrong with image upload',error:error.message})
            console.log("Error in upload Image",error)
        }
    }
]