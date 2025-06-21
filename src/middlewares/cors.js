import cors from 'cors';

const ACCEPTED_ORIGIN = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://sweetmomets:8080',
            'https://sweetmomets.com'
        ]; // Replace with your actual origin

export const corsMiddleware = ({acceptedOrigins: ACCEPTED_ORIGIN} = {}) => cors({
    origin: (origin, callback) => {
        if (!origin || ACCEPTED_ORIGIN.includes(origin)) {
            return callback(null, true);
        } 

        return callback(new Error('CORS policy violation: Origin not allowed'));
    }
})