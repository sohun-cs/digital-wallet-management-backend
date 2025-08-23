/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import CatchAsync from "../../utils/catch.async";
import { UserServices } from "./user.service";
import SendResponse from "../../utils/send.response";
import httpStatus from "http-status-codes";


const createUser = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userData = req.body
    const user = await UserServices.createUser(userData);

    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User is created successfully.",
        data: user
    })

});


const getAllUsers = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await UserServices.getAllUsers();

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All users retrieved successfully",
        data: users.users,
        meta: users.meta
    })

});


export const UserControllers = {

    createUser,
    getAllUsers
}