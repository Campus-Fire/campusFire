import config from '../../config';

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const upload = async (image: string, user: string): Promise<string> => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: '',
      folder: `${user}`,
    });

    console.log(result.url);

    return `${result.url}`;
  } catch (err) {
    console.log(err);
    throw new Error('err');
  }
};

export { upload };
