import { ErrorCodeFirebase } from "../utils/utils.js";

export class AuthenticationMidlleware{
    constructor(auth){
        this.auth = auth;
    }


    authenticate = async(req, res, next) => {
        let token = req.cookies.access_token;
        req.session = {user: null};
        if(!token){
            const tokenBearer = req.headers.authorization;
            if(tokenBearer && tokenBearer.startsWith('Bearer ')){
                token = tokenBearer.split(' ')[1];
            }else{  
                return res.status(401).json({message:'Acess not authorized'})
            }
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