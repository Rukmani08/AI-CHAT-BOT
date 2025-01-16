import { check, validationResult } from 'express-validator';
export const validate = (validations) => {
    return async (req, res, next) => {
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
export const loginValidator = [
    check("email").trim().isEmail().withMessage("Email is required"),
    check("password").trim().isLength({ min: 6 }).withMessage("Password should contain  atleast 6 characters"),
];
export const signupValidator = [
    check("name").notEmpty().withMessage("name is required"),
    ...loginValidator,
];
export const chatCompletionValidator = [
    check("message").notEmpty().withMessage("message is required"),
];
//# sourceMappingURL=validators.js.map