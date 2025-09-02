import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { AuthCheck } from "../../middlewares/auth.check";
import { Role } from "../user/user.interface";
import passport from "passport";


const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post("/reset-password", AuthCheck(...Object.values(Role)), AuthControllers.resetPassword);
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/'
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)

export const AuthRouter = router;