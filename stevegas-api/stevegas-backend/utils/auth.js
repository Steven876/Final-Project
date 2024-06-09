import express from "express";

// import {expressjwt} from 'express-jwt';

import JWT from 'jsonwebtoken';


const app = express();

export function isAuth(req, res, next){
    console.log(req.headers);
    console.log(new Date(new Date().getTime() + parseFloat(process.env.JWT_EXPIRES_IN)).toTimeString());
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null || !token) {
        return res.status(404).json({
            status: 'error',
            message: 'User Not Authorized'
        })
    }

    JWT.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error){
            console.log(error);

            return res.status(404).json({
                status: 'error',
                message: 'Access Not Allowed'
            })
        }
        next();
    })
}