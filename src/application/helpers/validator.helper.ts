import { UserInputError } from 'apollo-server';

import validateStringInputs from '../../../src/lib/string-validator';

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

export { validateEmailInput, validatePasswordInput, validateNameInput };
