/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ZodAny } from "zod";


export const zodValidationSchema = (zodObject: ZodAny) => async (req: Request, res: Response, next: NextFunction) => {

    await zodObject.parseAsync(req.body);

}