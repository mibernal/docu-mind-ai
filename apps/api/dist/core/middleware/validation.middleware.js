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
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors
                });
            }
            next(error);
        }
    };
};
// Validación para parámetros de URL
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Invalid URL parameters',
                    details: error.errors
                });
            }
            next(error);
        }
    };
};
// Validación para query parameters
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Invalid query parameters',
                    details: error.errors
                });
            }
            next(error);
        }
    };
};
