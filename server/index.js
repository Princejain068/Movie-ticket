import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user-routes.js';
import adminRouter from './routes/admin-routes.js'
import movieRouter from './routes/movie-routes.js';
import bookingRouter from './routes/booking-routes.js';
const port = process.env.PORT || 8000
dotenv.config();
const app = express()
app.use(co)
app.use(express.json())
app.use("/users",userRouter)
app.use("/admin",adminRouter)
app.use("/movie",movieRouter)
app.use("/booking",bookingRouter)
mongoose.connect(
    process.env.MONGO_URI,
    )
    .then(()=>{app.listen(port,()=>{console.log(`server is running on port ${port}`)})
    })
    .catch((e)=>{console.log(e);})

app.use('/',(req,res)=>{
    res.send('hi!');
})
