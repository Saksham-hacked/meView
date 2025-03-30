import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
});
import express from 'express';
import connectDb from './db/index.js';


connectDb();

