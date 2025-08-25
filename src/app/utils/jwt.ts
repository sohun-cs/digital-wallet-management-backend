import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';


export const generateToken = (payload: JwtPayload, secret: Secret, option: string) => {

    const accessToken = jwt.sign(payload, secret, { expiresIn: option } as SignOptions);

    return accessToken;

};


export const verifyToken = (token: string, secret: string) => {

    const verification = jwt.verify(token, secret);

    return verification;

}

