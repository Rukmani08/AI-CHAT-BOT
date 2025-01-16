import { Router } from "express";
import userRoutes from "./user-router.js";
import chatRoutes from "./chats-routes.js";
const appRouter = Router();
appRouter.use("/user", userRoutes);
appRouter.use("/chat", chatRoutes);
export default appRouter;
//# sourceMappingURL=index.js.map