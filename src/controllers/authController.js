import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
	const body = req.body;
	const { name, email, password } = body;

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ error: "Name, email, and password are required" });
	}

	const userExists = await prisma.user.findFirst({ where: { email: email } });
	if (userExists) {
		return res
			.status(400)
			.json({ error: "User with this email already exists" });
	}

	// Hash the password before storing it in the database
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create the user with the hashed password
	const user = await prisma.user.create({
		data: {
			name: name,
			email: email,
			password: hashedPassword,
		},
	});

	res.status(201).json({
		status: "success",
		data: { user: { id: user.id, name: user.name, email: user.email } },
	});
};
