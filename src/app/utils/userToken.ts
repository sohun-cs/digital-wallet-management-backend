import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../configs/env.config";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../middlewares/AppError";
import httpStatus from "http-status-codes";


export const createUserToken = (user: Partial<IUser>) => {

    const jwtPayload = {
        _id: user._id,
        email: user.email,
        password: user.password,
        role: user.role
    };


    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES);
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    return {
        accessToken,
        refreshToken
    }

}



export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExists = await User.findOne({ email: verifiedToken.email });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This user doesn't exist.");
    }

    if (isUserExists.isActive === IsActive.Inactive || isUserExists.isActive === IsActive.blocked) {
        throw new AppError(httpStatus.BAD_REQUEST, `This user is ${isUserExists.isActive}`)
    }

    if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
    }


    const jwtPayload = {
        _id: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES);

    return accessToken

}