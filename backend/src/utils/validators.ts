import {  Request, Response, NextFunction } from "express"
import { check, validationResult,  ValidationChain } from 'express-validator';




export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ errors: errors.array() });
  };
};

export const loginValidator =[
   
    check("email").trim().isEmail().withMessage("Email is required"),
    check("password").trim().isLength({min:6}).withMessage("Password should contain  atleast 6 characters"),
];

 export const signupValidator =[
  check("name").notEmpty().withMessage("name is required"),
    ...loginValidator,
]


export const chatCompletionValidator =[
  check("message").notEmpty().withMessage("message is required"),
  
]


