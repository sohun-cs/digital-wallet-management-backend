/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import CatchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.service";
import SendResponse from "../../utils/send.response";
import httpStatus from "http-status-codes";
import AppError from "../../middlewares/AppError";
import { setCookie } from "../../utils/sertCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../configs/env.config";
import passport from "passport";


// const credentialLogin = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const data = req.body;
//     const loginInfo = await AuthServices.credentialLogin(data);

//     setCookie(res, loginInfo);

//     SendResponse(res, {

//         statusCode: httpStatus.ACCEPTED,
//         success: true,
//         message: "User logging successfully",
//         data: loginInfo

//     })
// });


const credentialLogin = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            throw new AppError(401, info.message)
        }

        if (!user) {
            throw new AppError(404, info.message)
        }

        const userToken = await createUserToken(user);

        // delete user.toObject().password;
        const { password, ...rest } = user.toObject();

        setCookie(res, userToken);

        SendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                data: rest
            }
        })

    })(req, res, next)

})


export const getNewAccessToken = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token has been received.")
    }

    const loginInfo = await AuthServices.getNewAccessToken(refreshToken);

    setCookie(res, loginInfo)

    SendResponse(res, {

        statusCode: httpStatus.OK,
        success: true,
        message: "New Access token Retrieved Successfully",
        data: loginInfo

    })

});


export const logout = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    SendResponse(res, {

        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged Out Successfully",
        data: null

    })

})



const resetPassword = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodeToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodeToken as JwtPayload);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Updated Successfully",
        data: null
    })

})


const googleCallbackController = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {


    let redirectTo = req.query.state ? req.query.state as string : '';

    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);

    setCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})


export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}