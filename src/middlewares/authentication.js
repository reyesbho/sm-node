import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ErrorCodeFirebase } from "../utils/utils.js";

export class AuthenticationMidlleware{
    constructor(){
        const firebaseConfig = {
          type: process.env.TYPE,
          project_id: process.env.PROJECT_ID,
          private_key_id: process.env.PRIVATE_KEY_ID,
          private_key: process.env.PRIVATE_KEY,
          client_email: process.env.CLIENT_EMAIL,
          client_id: process.env.CLIENT_ID,
          auth_uri: process.env.AUTH_URI,
          token_uri: process.env.TOKEN_URI,
          auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
          universe_domain: process.env.UNIVERSE_DOMAIN
        };
        
        const app = initializeApp({
          credential: cert(firebaseConfig),
          databaseURL: "https://sweetmoments-17dc5-default-rtdb.firebaseio.com"
        });

        this.auth = getAuth(app);
        
    }


    authenticate = async(req, res, next) => {
        const token = req.cookies.access_token;
        req.session = {user: null};
        if(!token){
            return res.status(401).json({message:'Acess not authorized'})
        }

        try{
            const decodedToken = await this.auth.verifyIdToken(token);
            req.session.user = decodedToken.email;
            return next();
        }catch(error){
            if(error.code !== ErrorCodeFirebase.EXPIRED_TOKEN){
                return res.status(401).json({message:'Invalid token'})    
            }
        }
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken){
            return res.status(401).json({message:'Acess not authorized'})
        }
        try {
            const apiKey = process.env.APIKEY;
            const tokenResponse = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }),
            });

            const data = await tokenResponse.json();

            if (!tokenResponse.ok) throw new Error(data.error?.message);

            req.user = await auth.verifyIdToken(data.id_token);

            // Podrías devolver el nuevo token para que el cliente lo actualice
            res.cookie('access_token', data.id_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:'lax',
                    maxAge: 1000 * 60 * 60
                });
            
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Session close' });
        }
    }
}