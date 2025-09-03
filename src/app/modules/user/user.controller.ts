/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import CatchAsync from "../../utils/catch.async";
import { UserServices } from "./user.service";
import SendResponse from "../../utils/send.response";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


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


const updateUser = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_SECRET) as JwtPayload;

    // After adding a global custom user type for Express from interfaces 
    const verifiedToken = req.user;

    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: user
    })

})


export const UserControllers = {

    createUser,
    getAllUsers,
    updateUser
}