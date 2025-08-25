/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();


interface IEnvVars {
    DB_URL: string,
    PORT: string,
    NODE_ENV: string,
    SALT_ROUND: string,
    JWT_SECRET: string,
    JWT_EXPIRES: string,
}


const envConfiguration = (): IEnvVars => {

    const envVariableArr = ["DB_URL", "PORT", "NODE_ENV", "SALT_ROUND", "JWT_SECRET", "JWT_EXPIRES"];

    envVariableArr.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variables: ${key}`)
        }
    });

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        SALT_ROUND: process.env.SALT_ROUND as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES: process.env.JWT_EXPIRES as string,
    }
}


export const envVars: IEnvVars = envConfiguration()