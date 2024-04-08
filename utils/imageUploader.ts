import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';

export function upload(
  file: fileUpload.UploadedFile
): Promise<cloudinary.UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { format: file.mimetype.split('/')[1] },
        function (err, result) {
          if (err || !result) {
            console.log({ err });

            reject(err);
          } else {
            resolve(result);
          }
        }
      )
      .end(file.data);
  });
}
