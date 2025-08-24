import AppError from "../../middlewares/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';


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

    const loginUser = {
        email: isUserExists.email
    }

    return loginUser;
}


export const AuthServices = {
    credentialLogin
}


