/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';


export const generateToken = (payload: JwtPayload, secret: Secret, option: any) => {

    const accessToken = jwt.sign(payload, secret, { expiresIn: option });

    return accessToken;

};


export const verifyToken = (token: string, secret: Secret) => {

    const verification = jwt.verify(token, secret);

    return verification;

}

