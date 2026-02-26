import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
	const payload = { id: userId };
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Prevent CSRF -> prevents the cookie from being sent in cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    return token;
};
