import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { AuthRouter } from "../modules/auth/auth.route";



const routes = Router();

const routeConfigurations = [

    {
        path: "/users",
        route: UserRouter
    },
    {
        path: "/auth",
        route: AuthRouter
    }

]

routeConfigurations.forEach(route => {
    routes.use(route.path, route.route);
});


export const router = routes;