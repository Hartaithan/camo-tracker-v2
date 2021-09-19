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

		jwt.verify(refresh_token, process.env.JWT_TOKEN, (error, decoded) => {
			if (error instanceof jwt.TokenExpiredError) {
				console.error("Refresh token expired");
				// COMPLETE LOGOUT TODO
				return res.status(403).json({ message: "Refresh token expired" });
			}

			if (decoded.type !== "refresh") {
				return res.status(400).json({ message: "Invalid token" });
			}

			Token.findOne({ tokenId: decoded.id })
				.exec()
				.then((token) => {
					if (!token) {
						return res.status(400).json({ message: "Token not provided" });
					}
					return generateTokens(token.userId);
				})
				.then(({ token, refresh_token }) => res.json({ token, refresh_token }))
				.catch((error) => {
					console.error("Refresh token findOne error", error.message);
					res.status(400).json({ message: "Refresh token findOne error" });
				});
		});
	} catch (e) {
		console.error("/refresh error: ", e);
		res.status(500).json({ message: "Refresh token error" });
	}
});

module.exports = router;
