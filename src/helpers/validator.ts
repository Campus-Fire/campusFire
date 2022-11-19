import { UserInputError } from 'apollo-server';

const validateStringInputs = (input: string | string[]): void => {
  if (Array.isArray(input)) {
    input.forEach((elem: string) => {
      if (!elem.trim()) {
        throw new Error('Inputs cannot be empty strings');
      }
    });
  } else {
    if (!input.trim()) {
      throw new Error('Inputs cannot be empty strings');
    }
  }
};

const validateEmailInput = (email: string): void => {
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  validateStringInputs(email);

  if (!email.match(regEx)) {
    throw new UserInputError(' Email must be a valid email address');
  }
};

const validatePasswordInput = (password: string): void => {
  const regEx = /[\[\]\{\}\;\:\<\>\"\']/;

  validateStringInputs(password);

  if (password.match(regEx)) {
    throw new UserInputError('Invalid character in input');
  }
};

const validateNameInput = (name: string): void => {
  const regEx = /([a-zA-Z])+/;

  validateStringInputs(name);

  if (!name.match(regEx)) {
    throw new UserInputError('Invalid charater in input');
  }
};

export { validateStringInputs, validateEmailInput, validatePasswordInput, validateNameInput };
