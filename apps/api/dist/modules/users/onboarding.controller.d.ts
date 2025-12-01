import { Response } from 'express';
import { AuthRequest } from '../../core/middleware/auth.middleware';
export declare const setUserPreferences: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserPreferences: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserPreferences: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPredefinedTemplates: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addCustomField: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCustomField: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
