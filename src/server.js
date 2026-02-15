import express from "express";
import { router } from "./routes/movieRoutes.js";

const app = express();

const PORT = 5001;

app.use("/movies", router);

app.get("/item", (req, res) => {
	return res.json({ name: "Hello World!!" });
});

const server = app.listen(PORT, () => {
	console.log("Server is running!!!");
});
