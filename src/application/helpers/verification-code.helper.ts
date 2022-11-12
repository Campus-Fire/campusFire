const { getDigitalCode } = require('node-verification-code');

const getVerificationCode = (): number => {
  return Number(getDigitalCode(6).toString());
}

export default getVerificationCode;