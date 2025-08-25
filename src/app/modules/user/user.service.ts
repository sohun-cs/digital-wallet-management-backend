import AppError from "../../middlewares/AppError";
import { IAuthentication, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from 'bcryptjs';
import { envVars } from "../../configs/env.config";
import { JwtPayload } from "jsonwebtoken";


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.SALT_ROUND));


    const authProvider: IAuthentication = { provider: 'credentials', providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
}


const getAllUsers = async () => {

    const users = await User.find({});
    const totalUser = await User.countDocuments();

    return {
        users,
        meta: {
            total: totalUser
        }
    }
}



const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    }


    if (payload.email || payload.phone) {

        throw new AppError(httpStatus.BAD_REQUEST, "Email or Phone number cannot allowed to be changed");
    }

    if (payload.role) {
        if (decodedToken.role === Role.User || decodedToken.role === Role.Agent) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        };

        if (payload.role === Role.SuperAdmin && decodedToken.role === Role.Admin) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    };


    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.User || decodedToken.role === Role.Agent) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        };
    }


    const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return updatedUser;

}


export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}