import { model, Schema } from "mongoose";
import validator from "validator";
import { Gender, IAuthentication, IsActive, IUser, Role } from "./user.interface";


const authSchema = new Schema<IAuthentication>({
    provider: { type: String },
    providerId: { type: String },
}, {
    _id: false,
    versionKey: false
})


const userSchema = new Schema<IUser>({

    name: { type: String, trim: true },
    email: { type: String, unique: true, required: true, validate: [validator.isEmail, 'This email is bot valid'] },
    phone: { type: String, unique: true, validate: [validator.isMobilePhone, 'Your number is not valid'] },
    password: { type: String, minLength: [8, "Password should have minimum 8 digits."], required: true },
    nid: {
        type: String,
        unique: true,
        minlength: [8, 'NID no should have at least 8 numbers'],
        maxlength: [12, "NID no shouldn't have more than 12 numbers"],
        match: [/^[1-9][0-9]{7,11}$/, 'NID must contain only numbers and cannot start with 0']
    },
    pin: {
        type: String,
        minlength: [4, 'PIN must be 4 digits'],
        maxlength: [4, 'PIN must be 4 digits'],
        match: [/^[1-9][0-9]{3}$/, 'PIN must contain only numbers and cannot start with 0']
    },
    gender: { type: String, enum: Gender, lowercase: true },
    address: { type: String, maxLength: [50, 'Address length must not exceed more than 50 characters'] },
    role: { type: String, enum: Object.values(Role), default: Role.User, lowercase: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.Active, lowercase: true },
    isDeleted: { type: Boolean, default: false },
    wallet: { type: Schema.Types.ObjectId },
    transaction: { type: Schema.Types.ObjectId },
    auths: [authSchema]

}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema);