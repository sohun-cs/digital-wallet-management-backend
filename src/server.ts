/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/configs/env.config';


let server: Server;


const startServer = async () => {
    await mongoose.connect(envVars.DB_URL)
    console.log('Mongodb connected with mongoose')

    server = app.listen(envVars.PORT, () => {
        console.log(`Server is running on ${envVars.PORT}`)
    })
}

startServer();


process.on('unhandledRejection', (err) => {
    console.log(`Facing unhandledRejection error. The server is shutting down`, err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})


process.on("uncaughtException", (err) => {
    console.log(`Facing uncaughtException error. The server is shutting down.`, err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
});


process.on("SIGINT", () => {
    console.log(`Facing SIGINT error. The server is shutting down`);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
});


process.on("SIGTERM", () => {
    console.log("Facing SIGTERM error. The server is shuting down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    };

    process.exit(1);
})