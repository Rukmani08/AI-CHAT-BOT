
import {Box, Avatar, Typography, Button, IconButton} from "@mui/material"
import {useAuth} from "../context/AuthContext";
import {red} from "@mui/material/colors"
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useLayoutEffect, useRef, useState,  useEffect} from "react";
import { getUserChats, sendChatRequest, deleteUserChats } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Message = {
  role:  "user"| "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement |null>(null)
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const scroller = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async ()=>{
     const content = inputRef.current?.value.trim();
     if (!content) {
      toast.error("Please enter a message");
      return;
    }
     if(inputRef && inputRef.current){
      inputRef.current.value="";
     }
     const newMessage: Message ={role: "user", content};
     setChatMessages((prev)=>[...prev,  newMessage])

    

  try {
    const chatData = await sendChatRequest(content);
    if (chatData && chatData.chats) {
      setChatMessages([...chatData.chats]);
    } else {
      console.error("Invalid response from sendChatRequest");
    }
  } catch (error) {
    console.error("Error sending chat request:", error);
  }
  }

  const handleDeleteChats= async () =>{
    try{
      toast.loading("Deleting Chats", {id: "deletechats"})
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", {id: "deletechats"})

    }catch(error){
      console.log(error);
      toast.error("Deleting chats failed", {id: "deletechats"})
    }
  }

  useLayoutEffect(()=>{
    if(auth?.isLoggedIn && auth.user){
       toast.loading("Loading chats....", {id:"loadchats"})
       getUserChats().then((data)=>{
        setChatMessages([...data.chats]);
        toast.success("Successfully Loaded chats....", {id:"loadchats"})
       }).catch((err)=>{
        console.log(err);
        toast.error("failed to Load chats...",{id:"loadchats"})
    });
    }
  
   },[auth]);

   useEffect(()=>{
         if(!auth?.user){
          return navigate("/login")
         }
   },[auth]);

   useLayoutEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTo({
        top: scroller.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatMessages]);

  return (
    <Box  sx = {{display: "flex", flex: 1,  width: "100%", height: "100%", mt: 3, gap: 3,
    }}>
      

      <Box sx={{ display: {md: "flex",xs:"none", sm:"none"}, flex:0.2, flexDirection:"column"}}>

        <Box sx={{display: "flex",width:"100%", height:"60vh", bgcolor:"rgb(17,29,39)", borderRadius:5, flexDirection: "column", mx:3,

        }}
        >
          <Avatar sx ={{mx: "auto", my:2, bgcolor:"white", color:"black", fontweight:700,
          }}>
            {auth?.user?.name && auth.user.name[0]}
            {auth?.user?.name && auth.user.name.split(" ").length > 1 && auth.user.name.split(" ")[1][0]}
          </Avatar>
          <Typography sx={{mx:"auto",fontFamily: "work sans"}}>
              You are talking to a ChatBot
          </Typography>
          <Typography sx={{mx:"auto",fontFamily: "work sans", my:4, p:3}}>
              You can ask some question related to Knowledge, Business, Advices, Education, etc. But avoid sharing personal information.
          </Typography>
          <Button onClick={handleDeleteChats} sx = {{ width:"200px", my:"auto", color:"white", fontWeight:"700", borderRadius:3, mx:"auto", bgcolor:red[300],  ":hover"  : {"bgcolor": "red.A400",} ,}}>
              Clear Conversation
          </Button>
        </Box>
      </Box>

      <Box sx={{display:"flex,", flex: {md: 0.8, xs: 1, sm:1},flexDirection:"column", px:3 }}>
          <Typography sx={{textAlign:"center", fontSize:"40px", color:"white",mb:2, mx:"auto",fontWeight:"600"}}>
              Model-GPT 3.5 Turbo
          </Typography>
          
        
          <Box  ref={scroller} className="pb-2 md:pb-6" sx={{width:"100%", height:"60vh", borderRadius:3, mx:"auto", display:"flex", flexDirection:"column",  overflow:"scroll", overflowX:"hidden", overflowY:"auto", scrollBehavior:"smooth" }} >
            {chatMessages.map((chat, index)=> (
               < ChatItem content={chat.content} role = {chat.role} key={index}/>
              ))}
          </Box>
         

          <div style={{ width:"100%",  borderRadius:8, backgroundColor:"rgb(17,27,39)", display:"flex", margin:"auto"}}>
            {" "}
          <input  ref={inputRef} type='text' style={{width:"100%", backgroundColor:"transparent", padding:"30px", border:"none", outline:"none", color:"white", fontSize:"20px"}}/>

         <IconButton  onClick={handleSubmit} sx={{ml:"auto", color:"white" ,mx:1}}> 
          <IoMdSend/> 
         </IconButton>
          </div>
        
      </Box>
      
    </Box>
  )
}

export default Chat;
