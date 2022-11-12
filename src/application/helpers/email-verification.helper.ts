import nodemailer from 'nodemailer';

import config from '../../../config';

const sendVerificationEmail = (email: string, code: number) => {
  const transport = nodemailer.createTransport({
    host: config.EMAIL_SERVICE_HOST,
    port: config.EMAIL_SERVICE_PORT,
    secure: true,
    auth: {
      user: config.USER_EMAIL,
      pass: config.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'unitryst@gmail.com',
    to: `${email}`,
    subject: 'Verification code for UniTryst',
    text: `Please use the following verification code to confirm your registration on UniTryst. 
    
    ${code}`,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

export default sendVerificationEmail;
