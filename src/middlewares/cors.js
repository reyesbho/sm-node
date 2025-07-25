import cors from 'cors';

const ACCEPTED_ORIGIN = [
            'https://sweetmoments.mx',
            'https://www.sweetmoments.mx',
            'https://services.sweetmoments.mx',
            'https://www.services.sweetmoments.mx'
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