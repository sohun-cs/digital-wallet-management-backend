import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env.config";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";



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
            console.log("Error: ", error);
            return done(error)
        }

    })
))