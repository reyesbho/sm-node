import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export class AuthenticationMidlleware {
  constructor() {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.PROJECT_ID,
          clientEmail: process.env.CLIENT_EMAIL,
          privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    this.auth = getAuth();
  }

  authenticate = async (req, res, next) => {
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

      const decodedToken = await this.auth.verifyIdToken(token);

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


