

import { NextFunction, Request, Response } from "express";
import { configureOpenAI } from "../config/openai-config.js";
import User from "../models/User.js";


interface ChatCompletionRequestMessage {
  role: "user" | "assistant" ;
  content: string;
  
}

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

    const chats  = user.chats.map(({ role, content }) => ({
    role,
    content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    const openaiClient = configureOpenAI();
    const chatResponse = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

       // Validate chat response
    if (!chatResponse.choices[0].message) {
        return res.status(500).json({ message: "Failed to generate chat response" });
    }

    user.chats.push(chatResponse.choices[0].message);
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error: any) {
    // Handle specific OpenAI errors
    if (error.response) {
      const { status, data } = error.response;
      return res.status(status).json({ message: data.error.message });
    }

    // Handle generic errors
    console.log(error);
    return res.status(422).json({ message: "Something went wrong", error: error.message });
  }
};


export  const sendChatToUser = async (req:Request,res:Response,next:NextFunction) => {
   
  try{
     
       const user= await User.findById( res.locals.jwtData.id)
       if(!user){
          return res.status(401).send("User not registered OR Token malfunctioned")
       }
       console.log(user._id.toString(),res.locals.jwtData.id);
       if(user._id.toString()!==res.locals.jwtData.id){
          return res.status(401).send("permission didn't match")
       }
          return res.status(200).json({message:"OK", chats: user.chats })
  } catch (error) {
      console.log(error)
      return res.status(200).json({message:"ERROR",cause: error.message}) 

  }
}

export  const deleteChats = async (req:Request,res:Response,next:NextFunction) => {
   
  try{
     
       const user= await User.findById( res.locals.jwtData.id)
       if(!user){
          return res.status(401).send("User not registered OR Token malfunctioned")
       }
       console.log(user._id.toString(),res.locals.jwtData.id);
       if(user._id.toString()!==res.locals.jwtData.id){
          return res.status(401).send("permission didn't match")
       }
        //@ts-ignore
       user.chats = [];
       await user.save();   
;      return res.status(200).json({message:"OK", chats:user.chats })
  } catch (error) {
      console.log(error)
      return res.status(200).json({message:"ERROR",cause: error.message}) 

  }
}