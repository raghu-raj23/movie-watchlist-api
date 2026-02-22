import express from "express";
import { config } from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";

// Load environment variables immediately
config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

app.get("/item", (req, res) => {
    return res.json({ name: "Hello World!!" });
});

// Graceful Shutdown Helper
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    try {
        await disconnectDB();
        console.log("Database disconnected. Exiting process.");
        process.exit(0);
    } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
    }
};

// Async Server Startup
const startServer = async () => {
    try {
        // CRITICAL: Wait for Prisma and pg adapter to connect before listening
        await connectDB(); 
        
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}!!!`);
        });

        // Error Handlers for the running server
        process.on("unhandledRejection", (err) => {
            console.error("Unhandled Rejection:", err);
            server.close(() => gracefulShutdown("unhandledRejection"));
        });

        process.on("uncaughtException", (err) => {
            console.error("Uncaught Exception:", err);
            server.close(() => gracefulShutdown("uncaughtException"));
        });

        process.on("SIGTERM", () => server.close(() => gracefulShutdown("SIGTERM")));
        process.on("SIGINT", () => server.close(() => gracefulShutdown("SIGINT")));

    } catch (error) {
        console.error("Failed to start server due to DB connection error:", error);
        process.exit(1);
    }
};

startServer();