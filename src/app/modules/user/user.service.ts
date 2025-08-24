import AppError from "../../middlewares/AppError";
import { IAuthentication, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from 'bcryptjs';


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    console.log(hashedPassword)

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



export const UserServices = {
    createUser,
    getAllUsers
}