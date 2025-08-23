import express, { Application, Request, Response } from 'express';
import cors from "cors";
import httpStatus from 'http-status-codes';
import { router } from './app/routes/routes';
import { GlobalErrorHandler } from './app/middlewares/global.error.handler';
import { notFoundRoute } from './app/middlewares/not.found.route';


const app: Application = express();
app.use(express.json());
app.use("/api/v1", router);
app.use(cors())


app.get('/', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true
    })
})


// For Global Error Handler
app.use(GlobalErrorHandler);


// Not Found Route
app.use(notFoundRoute)

export default app;