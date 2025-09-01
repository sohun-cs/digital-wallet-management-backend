import { envVars } from "../configs/env.config";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";


export const createUserToken = async (user: Partial<IUser>) => {



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