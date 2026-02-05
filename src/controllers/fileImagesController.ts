import { Request, Response } from "express";
import { FileImagesModel } from "../models/aws/FileImages.js";

export class FileImagesController {
    constructor(private fileModel: FileImagesModel) {
    }


    uploadFile = (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Archivo requerido' });
        }

        const result = this.fileModel.saveImage(req.file as Express.MulterS3.File);

        return res.status(201).json({
            message: 'Archivo subido correctamente',
            file: result,
        });
    };
}