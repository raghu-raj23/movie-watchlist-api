import { PrismaClient } from "@prisma/client"; // Use standard import
// const { PrismaClient } = pkg; // Extract PrismaClient from the imported package
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
	log:
		process.env.NODE_ENV === "development"
			? ["query", "error", "warn"]
			: ["error"],
});

const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("Database connected successfully!!!");
	} catch (error) {
		console.error("Error connecting to the database: ", error);
		process.exit(1);
	}
};

const disconnectDB = async () => {
	await prisma.$disconnect();
	console.log("Database disconnected successfully!!!");
};

export { prisma, connectDB, disconnectDB };
1