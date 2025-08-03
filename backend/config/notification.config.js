import dotenv from 'dotenv';
dotenv.config();

export const NOTIFICATION_CONFIG = {
    email: {
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER,
            password: process.env.SMTP_PASS

        }
    }
};
