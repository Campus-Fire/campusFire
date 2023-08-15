import { Category } from '../application/models/event.model';
import { Country, Province } from '../lib/enum';
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

const validateProvinceInput = (province: string): void => {
  const validProvince = Object.values(Province).find((elem: string) => elem === province);

  if (!validProvince) {
    throw new CFError('INVALID_PROVINCE');
  }
};

const validateCountryInput = (country: string): void => {
  const validCountry = Object.values(Country).find((elem: string) => elem === country);

  if (!validCountry) {
    throw new CFError('INVALID_COUNTRY');
  }
};
const validateCategory = (category: string): void => {
  const validCategory = Object.values(Category).find((elem: string) => elem === category) ? true : false;

  if (!validCategory) {
    throw new CFError('INVALID_COUNTRY');
  }
};

export {
  validateStringInputs,
  validateEmailInput,
  validatePasswordInput,
  validateNameInput,
  validateCountryInput,
  validateProvinceInput,
  validateCategory,
};
