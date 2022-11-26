const getVerificationCode = (): string => {
  let code: number = 0;

  for (let num = 0; num < 6; num++) {
    code = code * 10 + Math.floor(Math.random() * 10);
  }

  return code.toString();
};

export default getVerificationCode;
