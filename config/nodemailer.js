import nodemailer from 'nodemailer';
import {EMAIL_FROM, EMAIL_PASSWORD} from '../config/env.js';
export const accountEmail = EMAIL_FROM;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'nikhil.indhanpay@gmail.com',
        pass: EMAIL_PASSWORD
    }
});

export default transporter;