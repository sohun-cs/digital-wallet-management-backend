import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";



const routes = Router();

const routeConfigurations = [

    {
        path: "/users",
        route: UserRouter
    }

]

routeConfigurations.forEach(route => {
    routes.use(route.path, route.route);
});


export const router = routes;