import AppError from "../../middlewares/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";


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

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    };

}



export const AuthServices = {
    credentialLogin,
    getNewAccessToken
}


