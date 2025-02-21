import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import axios from "axios";

interface JWTUser extends JwtPayload {
    id: string;
    tenant_id: string;
}

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json(
                new UnauthenticatedResponse("No token provided").generate()
            );
        }

         const VERIFY_TOKEN_API_URL = process.env.VERIFY_TOKEN_API_URL;
         if (!VERIFY_TOKEN_API_URL) {
             throw new Error("VERIFY_TOKEN_API_URL is not set in environment variables.");
         }
 
         const response = await axios.post<{ user: JWTUser }>(VERIFY_TOKEN_API_URL, { token });
 
         const decoded: JWTUser | undefined = response.data?.user;
         if (!decoded) {
             return res.status(401).json(
                 new UnauthenticatedResponse("Invalid token").generate()
             );
         }

        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (SERVER_TENANT_ID && decoded.tenant_id !== SERVER_TENANT_ID) {
            process.stdout.write(`${response.data.user.tenant_id}`);
            return res.status(401).json(
                new UnauthenticatedResponse(`decoded user id = ${decoded.id} Invalid tenant ${decoded.tenant_id} !== ${SERVER_TENANT_ID}`).generate()
            );
        }

        req.body.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json(
            new UnauthenticatedResponse("Invalid token").generate()
        );
    }
};