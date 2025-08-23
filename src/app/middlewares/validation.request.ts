import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";


export const ValidationRequest = (zodObject: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        req.body = await zodObject.parseAsync(req.body);

        next() // Must call. Otherwise you'll stuck here. 

    } catch (error) {
        next(error)
    }

}