/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import SendResponse from "../utils/send.response";
import httpStatus from 'http-status-codes'



export const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {

    SendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Page Not Found",
        data: null
    })

}