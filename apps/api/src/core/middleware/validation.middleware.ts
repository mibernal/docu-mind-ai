import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

export const validate = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
if (error instanceof ZodError) {
  const errors = error.issues.map(err => ({
    field: err.path.length > 0 ? err.path.join('.') : 'root',
    message: err.message
  }));
  return res.status(400).json({ errors });
}
      next(error);
    }
  };
};