import User from "../models/User.js";
import bcrypt from "bcrypt"
import Booking from "../models/Booking.js";
export const getAllUsers = async(req,res,next)=>{
    let users;
    try{
        users = await User.find()
    }
    catch(err){
        return console.log(err);
    }
    if(!users){
        return res.status(500).json({message:"No users found"})
    }

    return res.status(200).json({users})

}

export const signup = async (req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || name.trim()==="" ||!email ||email.trim()==="" ||!password||password.trim()===""){
        return res.status(422).json({message:"Please fill in all fields"})
    }

    let user;
    let hashedPassword = bcrypt.hashSync(password,10,function(err,hash){});
    try{
        user = new User({ name , email , password:hashedPassword })
        user = await user.save();
    }
    catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message:"No users found"})
    }

    return res.status(201).json({user})
}


export const updateUser = async (req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || name.trim()==="" ||!email ||email.trim()==="" ||!password||password.trim()===""){
        return res.status(422).json({message:"Please fill in all fields"})
    }

    let user;
    let id = req.params.id;
    let hashedPassword = bcrypt.hashSync(password,10,function(err,hash){});
    try{
        user = await User.findByIdAndUpdate(id, { name , email , password:hashedPassword })
    }
    catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message:"Something Went Wrong!!"})
    }

    return res.status(200).json({user})

}

export const deleteUser =async(req,res,next)=>{
    let id = req.params.id;
    let user;
    try{
         user = await User.findByIdAndDelete(id)
    }
    catch(err){
        return console.log(err);
        }
    if(!user){
        return res.status(500).json({message:"Something Went Wrong!!"})
    }
    return res.status(200).json({message:"User Deleted Successfully!!"})

}

export const login = async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email  || email.trim()===""  || !password || password.trim()===""){
        return res.status(422).json({message:"Please fill in all fields"})
    }
    let user;
    let hashedPassword;
    try{
        user = await User.findOne({email})
    }
    catch(err){
        return console.log(err);
        }
        if(!user){
            return res.status(404).json({message:"Invalid Email or Password!!"})
            }
            hashedPassword = bcrypt.compareSync(password,user.password);
            if(!hashedPassword){
            return res.status(400).json({message:"Invalid Email or Password!!"})
             }
    return res.status(200).json({message:"Login !!!"}) 
}

export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;
    let bookings;
    try {
        bookings = await Booking.find({ user: id })
        .populate("movie")
        .populate("user");
    } catch (err) {
        return console.log(err);
    }
    if (!bookings) {
        return res.status(500).json({ message: "Unable to get Bookings" });
    }
    return res.status(200).json({ bookings});
  };