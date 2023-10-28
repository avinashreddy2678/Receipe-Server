import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import dotenv from 'dotenv';
import { userrouter } from './Routes/UserRouter.js';
import { receiperouter } from './Routes/ReceipeRoute.js';
dotenv.config();
mongoose.connect(process.env.MONGOURI);
const app=express();

app.use(Cors());
app.use(express.json());


app.use("/user",userrouter);
app.use("/",receiperouter);

app.listen('4001'||process.env.PORT,()=>{
    console.log("Server is On Fire");
})
