import { NextFunction, Request, Response } from "express";
import { Auth } from "firebase-admin/auth";
import { authAdmin } from "../server.js";

export class AuthenticationMidlleware {
  private auth: Auth;
  constructor() {
    this.auth = authAdmin;
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;
      // 1️⃣ Cookie
      if (req.cookies?.access_token) {
        token = req.cookies.access_token;
      }

      // 2️⃣ Authorization header
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "Access not authorized" });
      }

       const decodedToken = await this.auth.verifySessionCookie(token, true);

      req.session = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role, // si usas custom claims
      };

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token expired or invalid",
      });
    }
  };
}


