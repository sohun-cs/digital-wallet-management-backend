import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import httpStatus from 'http-status-codes';
import { verifyToken } from "../utils/jwt";
import { envVars } from "../configs/env.config";
import { JwtPayload } from "jsonwebtoken";



export const AuthCheck = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized access");
        };

        //const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as { role: string }; // Approach: 1
        const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as JwtPayload; // Approach: 2

        if (!allowedRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You're not permitted to this routes")
        }

        req.user = verifiedToken;

        next()

    } catch (error) {
        next(error);
    }

}

