import { Response } from "express"


interface TMeta {
    total: number
}

interface TResponse<T> {
    statusCode: number,
    success: boolean,
    message: string,
    data: T,
    meta?: TMeta
}

const SendResponse = <T>(res: Response, data: TResponse<T>) => {

    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    })
}

export default SendResponse;