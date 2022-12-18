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
    text: `Please use the following verification code to confirm your registration on CampusFire.`,
    html: `<h1>${code}</h1>`,
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
    subject: 'Reset Password',
    text: `Copy & Paste in your Browser ${code}.\nThe link is only valid for 1 hour.`,
    html: `<h3>Your password reset Code is <h3> <h1>${code}</h1>`
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

export { sendVerificationEmail, sendPasswordResetEmail };
