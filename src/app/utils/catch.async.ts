import { NextFunction, Request, Response } from "express";


type CatchAsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const CatchAsync = (fn: CatchAsyncHandler) => (req: Request, res: Response, next: NextFunction) => {

    Promise.resolve(fn(req, res, next)).catch((err) => next(err))

};


export default CatchAsync;