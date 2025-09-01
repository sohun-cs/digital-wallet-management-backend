import { JwtPayload } from "jsonwebtoken";
import AppError from "../../middlewares/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../configs/env.config";
import { createUserToken } from "../../utils/userToken";


const credentialLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
    };

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExists.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    };

    const userToken = await createUserToken(isUserExists);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExists.toObject();

    const loginUser = {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }

    return loginUser;
}



export const getNewAccessToken = async (refreshToken: string) => {

    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExists = await User.findOne({ email: verifiedToken.email });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    if (isUserExists.isActive === IsActive.Inactive || isUserExists.isActive === IsActive.blocked) {
        throw new AppError(httpStatus.BAD_GATEWAY, `This user is ${isUserExists.isActive}`)
    }

    if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked");
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES);

    return accessToken;

}



export const AuthServices = {
    credentialLogin,
    getNewAccessToken
}


