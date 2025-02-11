import {Request, Response, NextFunction, RequestHandler } from "express"
import User from "../models/User.js"
import {hash,compare} from 'bcrypt'
import { createToken } from "../utils/token-manager.js"
import { COOKIE_NAME } from "../utils/constants.js"


export  const getAllUsers :RequestHandler= async (req:Request,res:Response,next:NextFunction) => {
   
    try{
         //get all users
        const users = await User.find()
        return res.status(200).json({message:"OK",users})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"ERROR",cause: error.message}) 

    }
};

export  const userSignup: RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
   
    try{
         //user signup
         const {name,email,password}=req.body;
         const existingUser=await User.findOne({email})
         if(existingUser) return res.status(401).send("User already registered")
         const hashedPassword = await hash(password, 10)
        const user = new User({name, email, password: hashedPassword})
        await user.save();

     //create and store cookie

     res.clearCookie(COOKIE_NAME, {
        httpOnly:true,
         secure: true,
         sameSite: "None",
         signed:true,
         path:"/",
      })    

     const token = createToken(user._id.toString(), user.email,  604800)
     const expires=new Date();
     expires.setDate(expires.getDate()+7)
     res.cookie(COOKIE_NAME,token, {
        path:"/",  
        secure: true,
        sameSite: "None",
        expires,
        httpOnly:true, 
        signed:true,})

        return res.status(201).json({message:"OK",name: user.name, email:user.email})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"ERROR",cause: error.message}) 

    }
}

export  const userLogin: RequestHandler= async (req:Request,res:Response,next:NextFunction) => {
   
    try{
         //user login
         const {email,password}=req.body;
         const user= await User.findOne({email})
         if(!user){
            return res.status(401).send("User not registered")
         }
         const isPasswordCorrect = await compare(password,user.password);
         if(!isPasswordCorrect){
            return res.status(403).send("Password is not correct")
         }

          res.clearCookie(COOKIE_NAME, {
            httpOnly:true,
            secure: true,
            sameSite: "None",
            signed:true,
            path:"/",
          })    

         const token = createToken(user._id.toString(), user.email,  604800)
         const expires=new Date();
         expires.setDate(expires.getDate()+7)
         res.cookie(COOKIE_NAME,token, {
            path:"/", 
            secure: true,
            sameSite: "None",
            expires,
            httpOnly:true, 
            signed:true,})
       
         return res.status(200).json({message:"OK",name: user.name, email: user.email})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"ERROR",cause: error.message}) 

    }
}


export  const verifyUser: RequestHandler= async (req:Request,res:Response,next:NextFunction) => {
   
    try{
       
         const user= await User.findById( res.locals.jwtData.id)
         if(!user){
            return res.status(401).send("User not registered OR Token malfunctioned")
         }
         console.log(user._id.toString(),res.locals.jwtData.id);
         if(user._id.toString()!==res.locals.jwtData.id){
            return res.status(401).send("permission didn't match")
         }

        return res.status(200).json({message:"OK",name: user.name, email: user.email})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"ERROR",cause: error.message}) 

    }
}


export  const userLogout : RequestHandler= async (req:Request,res:Response,next:NextFunction) => {
   
    try{
       
         const user= await User.findById( res.locals.jwtData.id)
         if(!user){
            return res.status(401).send("User not registered OR Token malfunctioned")
         }
         console.log(user._id.toString(),res.locals.jwtData.id);
         if(user._id.toString()!==res.locals.jwtData.id){
            return res.status(401).send("permission didn't match")
         }


         res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            signed: true,
            path: "/",
        }) 

        return res.status(200).json({message:"OK",name: user.name, email: user.email})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"ERROR",cause: error.message}) 

    }
}
