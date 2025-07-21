import mongoose from "mongoose";

const imageSchema =  new mongoose.Schema({
    url:{type:String,required:true},
    publicId:{type:String,required:true},
},{timestamps:true})

export default mongoose.model("AWS-Image",imageSchema)