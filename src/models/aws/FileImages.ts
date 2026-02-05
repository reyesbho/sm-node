export class FileImagesModel {
    constructor() {
    }

    saveImage(file: Express.MulterS3.File) {
    return {
      url: file.location,
      key: file.key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

}