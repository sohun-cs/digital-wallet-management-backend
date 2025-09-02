/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import CatchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.service";
import SendResponse from "../../utils/send.response";
import httpStatus from "http-status-codes";
import AppError from "../../middlewares/AppError";
import { setCookie } from "../../utils/sertCookie";


const credentialLogin = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = req.body;
    const loginInfo = await AuthServices.credentialLogin(data);

    setCookie(res, loginInfo);

    SendResponse(res, {

        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User logging successfully",
        data: loginInfo

    })
});


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

    await AuthServices.resetPassword(oldPassword, newPassword, decodeToken);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Updated Successfully",
        data: null
    })

})



export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword
}