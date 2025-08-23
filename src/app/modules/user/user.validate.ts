import z from "zod";
import { Gender, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z.string().min(2, "Name must be 2 characters long").max(20, "Name length must not exceed 20 characters long"),
    email: z.email("Invalid Email"),
    password: z.string().min(8, "Password must have at least 8 characters")
        .regex(/(?=.*[A-Z])/, "Password must contain a capital letter")
        .regex(/(?=.*[a-z])/, "Password must contain a small letter")
        .regex(/(?=.*[0-9])/, "Password must contain a number")
        .regex(/(?=.*[!@#$%&*-^_])/, "Password must contain a special character"),
    pin: z.number().int("Number should not float"),
    address: z.string().max(50, "Address must not exceed 50 characters"),
    nid: z.number(),
    gender: z.enum(Object.values(Gender)),
    role: z.enum(Object.values(Role)),
})



