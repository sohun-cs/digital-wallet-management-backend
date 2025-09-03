/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env.config";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import httpStatus from 'http-status-codes'
import bcrypt from "bcryptjs";



passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {

        const isUserExits = await User.findOne({ email });

        if (!isUserExits) {
            return done(null, false, { message: `${httpStatus.NOT_FOUND}: User does not exist` })
        }

        if (isUserExits.isActive === IsActive.Inactive || isUserExits.isActive === IsActive.blocked) {
            return done(null, false, { message: `This user is ${isUserExits.isActive}` })
        }

        if (isUserExits.isDeleted) {
            return done(null, false, { message: 'This user is blocked' })
        }

        const isGoogleAuthenticated = isUserExits.auths?.some(objects => objects.provider === 'google')

        if (isGoogleAuthenticated) {
            return done(null, false, { message: "This user already authenticated by google" })
        }

        const isPasswordMatched = await bcrypt.compare(password, isUserExits.password as string);

        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" })
        }

        return done(null, isUserExits)
    })
)




passport.use((
    new GoogleStrategy({
        clientID: envVars.GOOGLE_ID,
        clientSecret: envVars.GOOGLE_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_API
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

        try {

            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "Email nod found" })
            }

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email: email,
                    name: profile.displayName,
                    photo: profile.photos?.[0].value,
                    role: Role.User,
                    isVerified: true,
                    auths: [{
                        provider: 'google',
                        providerId: profile.id
                    }]
                })
            }

            return done(null, user)

        } catch (error) {
            return done(error)
        }

    })
))



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
})


passport.deserializeUser(async (id: string, done: any) => {
    try {

        const user = await User.findById(id);
        done(null, user)

    } catch (error) {
        done(error)
    }
})