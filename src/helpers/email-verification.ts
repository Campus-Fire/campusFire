import nodemailer from 'nodemailer';

import config from '../../config';

const transport = nodemailer.createTransport({
  host: config.EMAIL_SERVICE_HOST,
  port: config.EMAIL_SERVICE_PORT,
  secure: true,
  auth: {
    user: config.USER_EMAIL,
    pass: config.USER_PASSWORD,
  },
});

const sendVerificationEmail = (email: string, code: string): void => {
  const mailOptions = {
    from: 'CampusFire',
    to: `${email}`,
    subject: 'Verification code for CampusFire',
    text: `Please use the following verification code to confirm your registration on CampusFire.
    
    Code - ${code}`,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

const sendPasswordResetEmail = (email: string, code: string): void => {
  const mailOptions = {
    from: 'CampusFire',
    to: `${email}`,
    subject: 'Password Reset code',
    text: `Please use the following code to reset your password.
    
    Code - ${code}`,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

export { sendVerificationEmail, sendPasswordResetEmail };
