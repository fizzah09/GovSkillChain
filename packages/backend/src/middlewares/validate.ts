import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createError } from './errorHandler';

export function validate(schema: ZodSchema, target: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const messages = (result.error as ZodError).errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return next(createError(`Validation failed — ${messages}`, 400, 'VALIDATION_ERROR'));
    }
    req[target] = result.data;
    next();
  };
}
