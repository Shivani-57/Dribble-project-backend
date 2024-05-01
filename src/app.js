import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();

app.use(cors({
    origin: 'https://dribble-project-backend.onrender.com',
    methods:["POST","GET"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.use(cookieParser());



// Routes
import userRouter from './Routes/user.routes.js'

// Routing
app.use('/api/v1/users',userRouter)
app.get("/",(req,res)=>{
    res.json("HEllo Welcome")
})

export { app };
