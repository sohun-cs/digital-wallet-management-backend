import { Types } from "mongoose"


export enum Gender {
    Male = "male",
    Female = "female"
}

export enum IsActive {
    Active = "active",
    Inactive = "inactive",
    blocked = "blocked"
}

export enum Role {
    Admin = "admin",
    Agent = "agent",
    User = "user"
}

export interface IAuthentication {
    provider: string,
    providerId: string
}

export interface IUser {
    name: string,
    email: string,
    phone: string,
    password: string,
    nid: string,
    pin: string,
    gender: Gender,
    address: string,
    role?: Role,
    isVerified?: boolean,
    isActive?: IsActive
    isDeleted?: boolean,
    wallet?: Types.ObjectId,
    transaction?: Types.ObjectId[],
    auth?: [IAuthentication]
}