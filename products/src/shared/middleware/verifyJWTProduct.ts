import { Request, Response, NextFunction } from "express";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import axios from "axios";
import { User } from "../types/user";
import { Tenant } from "../types/tenant";

export const verifyJWTProduct = async (
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
    const GET_TENANT_API_URL = process.env.GET_TENANT_API_URL;
    const SERVER_TENANT_ID = process.env.TENANT_ID;

    if (!VERIFY_TOKEN_API_URL || !GET_TENANT_API_URL || !SERVER_TENANT_ID) {
        return res.status(500).send({ message: "Missing required server configurations" });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const tokenResponse = await axios.post<{ user: User }>(VERIFY_TOKEN_API_URL, { token });
    if (!tokenResponse.data || !tokenResponse.data.user) {
        return res.status(401).send({ message: "Invalid token tokenresponse" });
    }
    const user = tokenResponse.data.user;

    const tenantResponse = await axios.get<{ tenants: Tenant }>(`${GET_TENANT_API_URL}/${SERVER_TENANT_ID}`, config);
    if (!tenantResponse.data || !tenantResponse.data.tenants) {
        return res.status(500).send({ message: "Server Tenant not found" });
    }
    const tenant = tenantResponse.data.tenants;

    if (user.id !== tenant.owner_id) {
      return res.status(401).send({ message: `Invalid token user.id ${user.id} !== tenant.owner_id ${tenant.owner_id}` });
    }

    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse(`Invalid token catch: ${error}`).generate()
    );
  }
};
