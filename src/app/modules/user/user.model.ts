import { model, Schema } from "mongoose";
import validator from "validator";
import { Gender, IAuthentication, IsActive, IUser, Role } from "./user.interface";


const authSchema = new Schema<IAuthentication>({
    provider: { type: String },
    providerId: { type: String },
})


const userSchema = new Schema<IUser>({

    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, required: true, validate: [validator.isEmail, 'This email is bot valid'] },
    phone: { type: String, unique: true, required: true, validate: [validator.isMobilePhone, 'Your number is not valid'] },
    nid: {
        type: Number,
        min: [8, 'NID no should have at least 8 numbers'],
        max: [12, "NID no shouldn't have more than 12 numbers"],
        unique: true, required: true
    },
    gender: { type: String, enum: Gender, required: true },
    address: { type: String, max: [50, 'Address length must not exceed more than 50 characters'], required: true },
    role: { type: String, enum: Object.values(Role), default: Role.User, lowercase: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.Active, lowercase: true },
    isDeleted: { type: Boolean, default: false },
    wallet: { type: Schema.Types.ObjectId },
    transaction: { type: Schema.Types.ObjectId },
    auth: [authSchema]
})

export const User = model<IUser>("User", userSchema);