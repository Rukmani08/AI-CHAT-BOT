import app from  "./app.js";
import { connectionToDatabase } from "./db/connection.js";


//connection and listners
const PORT = process.env.PORT || 3000
connectionToDatabase()
.then(()=>{

  app.listen( PORT, ()=> console.log("server open & Connected to Database🚀 "))
})
.catch((err)=> console.log(err))

