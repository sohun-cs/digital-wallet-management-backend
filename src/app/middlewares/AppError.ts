/* eslint-disable @typescript-eslint/no-explicit-any */


class AppError extends Error {

    public statusCode: number

    constructor(statusCode: number, message: string, stack = '') {
        super(message) // Basically the default js's Error class message

        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export default AppError;