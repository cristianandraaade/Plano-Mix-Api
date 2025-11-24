import { getPayload } from '../Lib/Auth/JWT.ts'
import type { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    try {
        const payload = await getPayload(token);
        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }
};
