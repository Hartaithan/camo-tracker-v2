const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const { generateTokens } = require("../helpers/tokenHelper");
const router = Router();

router.post("/", async (req, res) => {
	try {
		const { refresh_token } = req.body;

		if (!refresh_token) {
			return res.status(400).json({ message: "Token not provided" });
		}

		jwt.verify(refresh_token, process.env.JWT_TOKEN, async (error, decoded) => {
			if (error instanceof jwt.TokenExpiredError) {
				console.error("Refresh token expired");
				return res.status(403).json({ message: "Your session has expired. Please log in" });
			}

			if (decoded.type !== "refresh") {
				return res.status(400).json({ message: "Invalid token" });
			}

			try {
				const user = await Token.findOne({ userId: decoded.userId });
				if (!user) {
					console.error("User not found in token collection");
					return res.status(400).json({ message: "User not found" });
				}
				return generateTokens(decoded.userId).then(({ token, refresh_token }) => res.json({ token, refresh_token }));
			} catch (error) {
				console.error("Refresh token findOne error", error.message);
				res.status(400).json({ message: "Refresh token findOne error" });
			}
		});
	} catch (e) {
		console.error("/refresh error: ", e);
		res.status(500).json({ message: "Refresh token error" });
	}
});

module.exports = router;
