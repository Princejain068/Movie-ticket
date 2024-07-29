import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movies.js";
import User from "../models/User.js";

export const newBooking = async(req,res,next)=>{
    const { movie, date, seatNumber, user } = req.body;

    let existingMovie;
    let existinguser;
    try{
        existingMovie = await Movie.findById(movie);
        existinguser = await User.findById(user);
    }
    catch(err){return console.log(err);}

    if(!existingMovie){
        return res.status(404).json({message:"No movie Found with given id"})
    }
    if(!existinguser){
        return res.status(404).json({message:"No user Found with given id"})
    }
    let booking;

    try {
        booking = new Booking({movie,date:new Date(`${date}`),seatNumber,user})
        const session =await mongoose.startSession();
        session.startTransaction();
        existinguser.bookings.push(booking);
        existingMovie.bookings.push(booking)
        await existinguser.save({session});
        await existingMovie.save({session});
        booking = await booking.save({session});
        session.commitTransaction();
    } catch (err) {
        return console.log(err);
    }
    if(!booking){
        return res.status(500).json({message:"Unable to create booking"});
    }
    res.status(201).json({message:"Booking created successfully",booking});
}

export const getBookingById = async (req, res, next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(id);
    } catch (err) {
        return console.log(err);
    }
    if (!booking) {
        return res.status(500).json({ message: "Unexpected Error" });
    }
    return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Booking.findByIdAndDelete(id).populate("user movie");
        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);
        await booking.movie.save({ session });
        await booking.user.save({ session });
        session.commitTransaction();
    } catch (err) {
        return console.log(err);
    }
    if (!booking) {
        return res.status(500).json({ message: "Unable to Delete" });
    }
        return res.status(200).json({ message: "Successfully Deleted" });
  };