import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signUp = () => {
    // Build a JWT payload. { id, email }
    const payload = { id: mongoose.Types.ObjectId().toHexString(), email: 'test@test.com' };
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build the session object { jwt: MY_JWT }
    const sessionObj = { jwt: token };
    // Turn that session object into JSON
    const sessionJSON = JSON.stringify(sessionObj);
    // Encode JSON to base64
    const base64data = Buffer.from(sessionJSON).toString('base64');
    // Build a string representing the cookie with the encoded data
    return [`express:sess=${base64data}`];
};
