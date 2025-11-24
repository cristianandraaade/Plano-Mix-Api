import type { Request, Response, NextFunction } from "express";

export const admin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            status: false,
            message: "Requisição inválida!"
        });
    }

    if (req.user?.type == 'admin') {
        return next();
    }

    return res.status(401).json({
        status: false,
        message: "Tipo de conta inválido para essa ação!"
    });
};
