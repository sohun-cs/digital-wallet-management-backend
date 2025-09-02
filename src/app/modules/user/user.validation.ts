import z from "zod";
import { Gender, IsActive, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z.string().min(2, "Name must be 2 characters long").max(20, "Name length must not exceed 20 characters long").optional(),
    email: z.email("Invalid Email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    password: z.string().min(8, "Password must have at least 8 characters")
        .regex(/(?=.*[A-Z])/, "Password must contain a capital letter")
        .regex(/(?=.*[a-z])/, "Password must contain a small letter")
        .regex(/(?=.*[0-9])/, "Password must contain a number")
        .regex(/(?=.*[!@#$%&*-^_])/, "Password must contain a special character").optional(),
    pin: z.string().optional(),
    address: z.string().max(50, "Address must not exceed 50 characters").optional(),
    nid: z.string().optional(),
    gender: z.enum(Object.values(Gender).map(v => v.toLowerCase() as string)).optional()
})


export const updateUserZodSchema = z.object({
    name: z.string().min(2, "Name must be 2 characters long").max(20, "Name length must not exceed 20 characters long").optional(),

    password: z.string().min(8, "Password must have at least 8 characters")
        .regex(/(?=.*[A-Z])/, "Password must contain a capital letter")
        .regex(/(?=.*[a-z])/, "Password must contain a small letter")
        .regex(/(?=.*[0-9])/, "Password must contain a number")
        .regex(/(?=.*[!@#$%&*-^_])/, "Password must contain a special character").optional(),
    pin: z.string().optional(),
    address: z.string().max(50, "Address must not exceed 50 characters").optional(),
    nid: z.string().optional(),
    gender: z.enum(Object.values(Gender).map(v => v.toLowerCase() as string)).optional(),
    role: z.enum(Object.values(Role).map(v => v.toLowerCase() as string)).optional(),
    isVerified: z.boolean().optional(),
    isActive: z.enum(Object.values(IsActive).map(v => v.toLowerCase() as string)).optional().optional(),
    isDeleted: z.boolean().optional(),
})



