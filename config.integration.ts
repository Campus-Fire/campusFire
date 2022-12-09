const config = {
  MONGO_CONNECTION_STRING:
    'mongodb+srv://campusfire-staging-rw:52lpwAZOtn34eNwY@cluster0.tfweizu.mongodb.net/?retryWrites=true&w=majority',
  DB_NAME: 'campusFire',

  SECRET_TOKEN_KEY: 'campus_fire_secret_key_for_json_web_tokens',

  USER_EMAIL: 'unitryst@gmail.com',
  USER_PASSWORD: 'hycqmgvyfjaloiaj',
  EMAIL_SERVICE_HOST: 'smtp.gmail.com',
  EMAIL_SERVICE_PORT: 465,

  CLOUDINARY_URL: 'cloudinary://834917414362113:FtT-tAuv9cE_w_b0x3saYEgLP_w@dt0duopxa',
  CLOUDINARY_CLOUD_NAME: 'dt0duopxa',
  CLOUDINARY_API_KEY: '834917414362113',
  CLOUDINARY_API_SECRET: 'FtT-tAuv9cE_w_b0x3saYEgLP_w',
};

export default config;
