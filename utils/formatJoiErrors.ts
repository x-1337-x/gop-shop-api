import { ValidationErrorItem } from 'joi';

export function formatJoiErrors(errors: ValidationErrorItem[]) {
  const formattedErrors: Record<string, string[]> = {};

  for (const error of errors) {
    const key = error.path.join('.');
    if (formattedErrors[key] === undefined) {
      formattedErrors[key] = [];
    }
    formattedErrors[key].push(error.message);
  }

  return formattedErrors;
}
