import app from  "./app.js";
import { connectionToDatabase } from "./db/connection.js";
import express from 'express';
import path from 'path';

const app = express();

// Serve the frontend files from the public folder
app.use(express.static(path.join(__dirname, 'backend-public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend-public/index.html'));
});

//connection and listners
const PORT=process.env.PORT || 3000;
connectionToDatabase()
.then(()=>{

  app.listen( PORT, ()=> console.log("server open & Connected to Database🚀 "))
})
.catch((err)=> console.log(err))

