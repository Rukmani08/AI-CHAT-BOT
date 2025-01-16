import { connect, disconnect } from "mongoose";
async function connectionToDatabase() {
    try {
        await connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new error("Cannot Connect to MongoDB");
    }
}
async function disconnectFromDatabase() {
    try {
        await disconnect();
    }
    catch (error) {
        console.log(error);
        throw new error("Cannot Connect to MongoDB");
    }
}
export { connectionToDatabase, disconnectFromDatabase };
//# sourceMappingURL=connection.js.map