// middlewares/upload.middleware.ts
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const uploadImageMulter = (s3: S3Client) => {
    return  multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME!,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, cb) => {
            cb(null, `images/${file.originalname}`);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        });
}
