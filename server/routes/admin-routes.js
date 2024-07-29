import express from 'express';
import { addAdmin,getAdmins,login } from '../controllers/admin-controller.js';

const adminRouter = express.Router();

adminRouter.post("/signup",addAdmin);
adminRouter.post("/login",login);
adminRouter.get("/",getAdmins);

export default adminRouter