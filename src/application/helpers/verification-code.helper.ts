const getVerificationCode = (): number => {
  let code: number = 0;

  for (let num = 0; num < 6; num++) {
    code = code * 10 + Math.floor(Math.random() * 10);
  }
  console.log(code);

  return code;
};

export default getVerificationCode;
