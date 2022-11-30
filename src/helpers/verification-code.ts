const getVerificationCode = (): string => {
  let code: number = Math.floor(Math.random() * 10);

  if (!code || code === 0) {
    code = 5;
  }

  for (let num = 0; num < 4; num++) {
    code = code * 10 + Math.floor(Math.random() * 10);
  }

  return code.toString();
};

export default getVerificationCode;
