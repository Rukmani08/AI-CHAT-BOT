import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken'
import { COOKIE_NAME } from './constants.js';


export const createToken= (id: string, email: string, expiresIn: number)=>{
    const payload= {id, email}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });

    return token;
};


export const verifyToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.signedCookies[`${COOKIE_NAME}`];
      if (!token || token.trim() === '') {
        return res.status(401).json({ message: 'Token Not Received' });
      }
       return  jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
          
          return res.status(401).json({ message: 'Token Expired' });
        } else {
          
          res.locals.jwtData = success;
          return next();
        }
      });
    } catch (error) {
      return res.status(401).json({ message: 'Error Verifying Token' });
    }
  };
  
