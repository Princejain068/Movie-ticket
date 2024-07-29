import Admin from "../models/Admin.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const addAdmin = async (req,res,next)=>{
    const { email, password } = req.body;
    if (!email || email.trim() === "" || password && password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    let existingAdmin;
    try {
    existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password,10,function(error,hash){});
    try {
        admin = new Admin({ email, password: hashedPassword });
        admin = await admin.save();
    } catch (err) {
        return console.log(err);
    }
    if (!admin) {
        return res.status(500).json({ message: "Unable to store admin" });
    }
    return res.status(201).json({ admin });
}


export const login =async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||email.trim()===""||password&&password.trim()===""){
        return res.status(422).json({message:"Invalid Inputs"});
    }
    let admin;
    try{
        admin=await Admin.findOne({email});
    }
    catch(err){ return console.log(err);}
    if(!admin){
        return res.status(401).json({message:"Invalid Credentials"});
    }
    const isMatch=bcrypt.compareSync(password,admin.password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid Credentials"});
    }
    const token = jwt.sign({id:admin._id},process.env.SECRET_KEY,{expiresIn:"7d"})
    return res.status(200).json({message:"Accepted !!",token,id:admin._id});
}

export const getAdmins = async(req,res,next)=>{
    let admins;
    try{
        admins = await Admin.find();
    }
    catch(err){return console.log(err);}

    if(!admins){
        return res.status(505).json({message:"Something Occured"})
    }

    return res.status(200).json({admins})

}
