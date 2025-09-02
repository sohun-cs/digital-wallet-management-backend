import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import httpStatus from 'http-status-codes';
import { verifyToken } from "../utils/jwt";
import { envVars } from "../configs/env.config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";



export const AuthCheck = (...allowedRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized access");
        };

        //const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as { role: string }; // Approach: 1
        const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as JwtPayload; // Approach: 2

        const isUserExists = await User.findOne({ email: verifiedToken.email });

        if (!isUserExists) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        if (isUserExists.isActive === IsActive.Inactive || isUserExists.isActive === IsActive.blocked) {
            throw new AppError(httpStatus.BAD_REQUEST, `This user is ${isUserExists.isActive}`)
        }

        if (isUserExists.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
        }

        if (!allowedRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You're not permitted to this routes")
        }

        req.user = verifiedToken;

        next()

    } catch (error) {
        next(error);
    }

}

