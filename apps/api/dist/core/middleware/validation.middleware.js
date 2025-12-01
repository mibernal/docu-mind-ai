import { ZodError } from 'zod';
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
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
