import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

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
	const token = generateToken(user.id, res);

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
		data: {
			user: { id: user.id, name: user.name, email: user.email },
			token: token,
		},
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	const user = await prisma.user.findFirst({ where: { email: email } });
	if (!user) {
		return res.status(400).json({ error: "Invalid email or password" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ error: "Invalid email or password" });
	}

	// Generate JWT token
	const token = generateToken(user.id, res);

	res.status(200).json({
		status: "success",
		data: { user: { id: user.id, email: user.email }, token: token },
	});
};

export const logout = async (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(0), // Set the cookie to expire immediately
	});
	res
		.status(200)
		.json({ status: "success", message: "Logged out successfully" });
};
