import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { ValidationRequest } from "../../middlewares/validation.request";
import { AuthCheck } from "../../middlewares/auth.check";
import { Role } from "./user.interface";


const router = Router();

router.post("/register", ValidationRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", AuthCheck(Role.Admin, Role.SuperAdmin), UserControllers.getAllUsers);
router.patch("/:id", AuthCheck(...Object.values(Role)), UserControllers.updateUser);

export const UserRouter = router;