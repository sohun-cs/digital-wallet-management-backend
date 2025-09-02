import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { AuthCheck } from "../../middlewares/auth.check";
import { Role } from "../user/user.interface";


const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post("/reset-password", AuthCheck(...Object.values(Role)), AuthControllers.resetPassword)

export const AuthRouter = router;