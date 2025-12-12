import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from "../../shared/jwt";
export interface AuthRequest extends Request {
    user?: TokenPayload;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
