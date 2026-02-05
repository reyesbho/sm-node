import cors from 'cors';

const ACCEPTED_ORIGIN = [
            'https://sweetmoments.mx',
            'https://www.sweetmoments.mx',
            'https://services.sweetmoments.mx',
            'https://www.services.sweetmoments.mx',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:8081',
            'https://sweet-moments-alternative.vercel.app',
            'https://sm-node-git-dev-reyes-projects-aff0f296.vercel.app'
        ]; 

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        if (!origin || ACCEPTED_ORIGIN.includes(origin)) {
            return callback(null, true);
        } 
        
        
        return callback(new Error('CORS policy violation: Origin not allowed'));
    },
    credentials: true
})