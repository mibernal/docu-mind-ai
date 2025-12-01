import { Request, Response } from 'express';
export declare const createTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTemplates: (req: Request, res: Response) => Promise<void>;
export declare const updateTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
