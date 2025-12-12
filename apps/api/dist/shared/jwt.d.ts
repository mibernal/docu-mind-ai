export interface TokenPayload {
    userId: string;
    email: string;
    organizationId: string;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
