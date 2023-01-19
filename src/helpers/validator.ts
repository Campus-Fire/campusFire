import { CFError } from '../lib/errors-handler';

const validateStringInputs = (input: string | string[]): void => {
  if (Array.isArray(input)) {
    input.forEach((elem: string) => {
      if (!elem.trim()) {
        throw new CFError('INVALID_USER_INPUT');
      }
    });
  } else {
    if (!input.trim()) {
      throw new CFError('INVALID_USER_INPUT');
    }
  }
};

const validateEmailInput = (email: string): void => {
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  validateStringInputs(email);

  if (!email.match(regEx)) {
    throw new CFError('INVALID_EMAIL');
  }
};

const validatePasswordInput = (password: string): void => {
  const regEx = /[\[\]\{\}\;\:\<\>\"\']/;

  validateStringInputs(password);

  if (password.match(regEx)) {
    throw new CFError('INVALID_USER_INPUT');
  }
};

const validateNameInput = (name: string): void => {
  const regEx = /([a-zA-Z])+/;

  validateStringInputs(name);

  if (!name.match(regEx)) {
    throw new CFError('INVALID_USER_INPUT');
  }
};

export { validateStringInputs, validateEmailInput, validatePasswordInput, validateNameInput };
