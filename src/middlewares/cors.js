import cors from 'cors';

const ACCEPTED_ORIGIN = [
            'https://sweetmoments.mx',
            'https://services.sweetmoments.mx'
        ]; 

export const corsMiddleware = ({acceptedOrigins: ACCEPTED_ORIGIN} = {}) => cors({
    origin: (origin, callback) => {
        if (!origin || ACCEPTED_ORIGIN.includes(origin)) {
            return callback(null, true);
        } 

        return callback(new Error('CORS policy violation: Origin not allowed'));
    }
})