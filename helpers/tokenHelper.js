const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");

function generateAccessToken(userId) {
	return jwt.sign({ userId, type: "access" }, process.env.JWT_TOKEN, { expiresIn: "1h" });
}

function generateRefreshToken() {
	const id = uuid();
	return {
		id,
		token: jwt.sign({ id, type: "refresh" }, process.env.JWT_TOKEN, { expiresIn: "30d" }),
	};
}

async function updateToken(tokenId, userId) {
	const userToken = await Token.findOne({ userId });

	if (!userToken) {
		const newToken = new Token({ tokenId, userId });
		await newToken.save();
	} else {
		await userToken.updateOne({ tokenId });
	}
}

function generateTokens(userId) {
	const access = generateAccessToken(userId);
	const refresh = generateRefreshToken(userId);

	return updateToken(refresh.id, userId).then(() => ({
		token: access,
		refresh_token: refresh.token,
	}));
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	updateToken,
	generateTokens,
};
