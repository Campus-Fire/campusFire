import errorMessages from '../application/lang/en.json';

class CFError extends Error {
  code: string;
  override message: string;

  constructor(code: keyof typeof errorMessages) {
    super();
    this.code = code;
    this.message = errorMessages[code];
  }
}

export { CFError };
