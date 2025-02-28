import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import App from './App.tsx'
import './index.css'
import { createTheme,ThemeProvider  } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from "axios";
import { Toaster } from 'react-hot-toast'
axios.defaults.baseURL = "https://ai-chat-bot-kedd.onrender.com/api/v1"
// axios.defaults.baseURL = "http://localhost:3000/api/v1" ;
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography:{
    fontFamily: "Work Sans,serif",
    allVariants : {color:"white"},
  },
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Toaster position='top-right'/>
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
