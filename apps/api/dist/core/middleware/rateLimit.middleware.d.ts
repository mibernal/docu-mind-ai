export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const createCustomLimiter: (windowMs: number, max: number, message: string) => import("express-rate-limit").RateLimitRequestHandler;
