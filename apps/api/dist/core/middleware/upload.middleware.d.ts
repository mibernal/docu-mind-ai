import multer from 'multer';
import { Request } from 'express';
export declare const upload: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: any, next: any) => any;
