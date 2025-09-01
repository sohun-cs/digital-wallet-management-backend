/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import CatchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.service";
import SendResponse from "../../utils/send.response";
import httpStatus from "http-status-codes";


const credentialLogin = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = req.body;
    const loginUser = await AuthServices.credentialLogin(loginInfo);

    SendResponse(res, {

        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User logging successfully",
        data: loginUser

    })
});


export const getNewAccessToken = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await AuthServices.getNewAccessToken(refreshToken);

    SendResponse(res, {

        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: newAccessToken

    })

})



export const AuthControllers = {
    credentialLogin,
    getNewAccessToken
}