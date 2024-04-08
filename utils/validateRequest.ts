import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { formatJoiErrors } from './formatJoiErrors';

const JOI_VALIDATION_COFING = {
  abortEarly: false,
  stripUnknown: true,
};

export function validateRequest(config: {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}) {
  return function validator(req: Request, res: Response, next: NextFunction) {
    // params
    if (config.params) {
      const result = config.params.validate(req.params, JOI_VALIDATION_COFING);

      if (result.error) {
        return res.status(400).json(formatJoiErrors(result.error.details));
      }

      req.params = result.value;
    }

    // query
    if (config.query) {
      const result = config.query.validate(req.query, JOI_VALIDATION_COFING);

      if (result.error) {
        return res.status(400).json(formatJoiErrors(result.error.details));
      }

      req.query = result.value;
    }

    // body
    if (config.body) {
      const result = config.body.validate(req.body, JOI_VALIDATION_COFING);

      if (result.error) {
        return res.status(400).json(formatJoiErrors(result.error.details));
      }

      req.body = result.value;
    }

    next();
  };
}
