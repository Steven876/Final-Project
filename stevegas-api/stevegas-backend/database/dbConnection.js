import mysql from 'mysql2';
import dotenv from 'dotenv';

//Configuration settings from config.env

dotenv.config({path: './config.env'});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

}).promise();

