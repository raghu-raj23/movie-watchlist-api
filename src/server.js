import express from "express";
import { router } from "./routes/movieRoutes.js";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";

config();
connectDB();

const app = express();

const PORT = 5001;

app.use("/movies", router);

app.get("/item", (req, res) => {
	return res.json({ name: "Hello World!!" });
});

const server = app.listen(PORT, () => {
	console.log("Server is running!!!");
});

process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection: ", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});
process.on("uncaughtException", (err) => {
	console.error("Unhandled Rejection: ", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});
process.on("SIGTERM", (err) => {
	console.error("Unhandled Rejection: ", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});
