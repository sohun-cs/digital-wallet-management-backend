/* eslint-disable no-console */
import { envVars } from "../configs/env.config";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { IAuthentication, IUser, Role } from "../modules/user/user.interface";
import AppError from "../middlewares/AppError";


export const seedSuperAdmin = async () => {

    try {

        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super Admin is Already Exist")
            return;
        }

        console.log("Trying create super admin. Please wait a moment");

        const authProvider: IAuthentication = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const superAdminPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.SALT_ROUND));

        const payload: IUser = {
            email: envVars.SUPER_ADMIN_EMAIL,
            password: superAdminPassword,
            role: Role.SuperAdmin,
            isVerified: true,
            auths: [authProvider]
        };

        const superAdmin = await User.create(payload);

        console.log(superAdmin)

    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, `Unable to create super admin ${error}`);
    }

}