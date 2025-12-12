import { Response } from 'express';
import { AuthRequest } from '../../core/middleware/auth.middleware.js';
export declare const uploadDocument: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDocuments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDocument: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDocumentMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDocumentStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDocument: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
