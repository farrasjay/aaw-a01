import { Request, Response, NextFunction } from "express";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import { User } from "../types/user";
import axios from "axios";

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token bearer" });
    }

    const VERIFY_TOKEN_API_URL = process.env.VERIFY_TOKEN_API_URL;
    if (!VERIFY_TOKEN_API_URL) {
        return res.status(500).send({ message: "Missing token verification API URL" });
    }

    const response = await axios.post<{ user: User }>(VERIFY_TOKEN_API_URL, { token });

    if (!response.data || !response.data.user) {
        return res.status(401).send({ message: "Invalid token response data" });
    }

    req.body.user = response.data.user;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse(`Invalid token catch ${error}`).generate()
    );
  }
};
