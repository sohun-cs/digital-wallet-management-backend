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


export const AuthControllers = {
    credentialLogin
}