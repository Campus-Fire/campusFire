import nodemailer from 'nodemailer';

import config from '../../config';

const transport = nodemailer.createTransport({
  service: config.EMAIL_SERVICE_NAME,
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
    from: `"CampusFire Support" <${config.USER_EMAIL}`,
    to: `${email}`,
    subject: 'Verification code for CampusFire',
    html: `
    <table width="80%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          <div>
            <img src="https://res.cloudinary.com/dt0duopxa/image/upload/v1670830815/Assets/logo_fc3pqa.png" alt="logo" align="center"/>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          <div>
            <p>Please use the following verification code to confirm your registration on CampusFire.</p>
            <h2>${code}</h2>
          </div>
        </td>
      </tr>
    </table>
    `,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

const sendPasswordResetEmail = (email: string, code: string): void => {
  const mailOptions = {
    from: `"CampusFire Support" <${config.USER_EMAIL}`,
    to: `${email}`,
    subject: 'Reset Password',
    html: `
     <table width="80%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          <div>
            <img src="https://res.cloudinary.com/dt0duopxa/image/upload/v1670830815/Assets/logo_fc3pqa.png" alt="logo" align="center"/>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          <div>
            <p>Your code for password reset is: </p>
            <h2>${code}</h2>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          <div>
            <p>If you didn't request for a password reset, you can ignore this!</p>
          </div>
        </td>
      </tr>
    </table>
    `,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

export { sendVerificationEmail, sendPasswordResetEmail };
