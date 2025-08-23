/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();


interface IEnvVars {
    DB_URL: string,
    PORT: string,
    NODE_ENV: string,
}


const envConfiguration = (): IEnvVars => {

    const envVariableArr = ["DB_URL", "PORT", "NODE_ENV"];

    envVariableArr.forEach((key) => {
        if (!process.env[key]) {
            console.log(`Missing environment variables: ${key}`)
        }
    });

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
    }

}


export const envVars: IEnvVars = envConfiguration()