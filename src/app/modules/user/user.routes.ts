import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { ValidationRequest } from "../../middlewares/validation.request";


const router = Router();

router.post("/register", ValidationRequest(createUserZodSchema), UserControllers.createUser);
router.get("/", UserControllers.getAllUsers);

export const UserRouter = router;