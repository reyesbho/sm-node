import { Router } from "express";
import { FileImagesModel } from "../models/aws/FileImages.js";
import { FileImagesController } from "../controllers/fileImagesController.js";
import { uploadImageMulter } from "../middlewares/multer.js";
import { S3Client } from "@aws-sdk/client-s3";

export const createFileImageRouter = (fileModel: FileImagesModel, s3: S3Client) =>{
    const fileImagesRouter = Router();
    const fileImagesController = new FileImagesController(fileModel);

    fileImagesRouter.post('/',uploadImageMulter(s3).single('file'), fileImagesController.uploadFile);
    
    return fileImagesRouter;

}