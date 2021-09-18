const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const Token = require("../models/token");
const router = Router();

router.post("/register", [check("email", "Invalid email. An email adress must contain single @").isEmail(), check("password", "Invalid password. Password must be at least 6 characters").isLength({ min: 6 })], async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: "Validation errors in registration",
			});
		}

		const { email, nick, password, state } = req.body;

		const emailIsUsed = await User.findOne({ email });
		if (emailIsUsed) {
			return res.status(300).json({ message: "Email is already used." });
		}

		const nickIsUsed = await User.findOne({ nick });
		if (nickIsUsed) {
			return res.status(300).json({ message: "Nickname is already used." });
		}

		const hashedPass = await bcrypt.hash(password, 12);

		const newUser = new User({
			email,
			nick,
			password: hashedPass,
			state,
		});

		await newUser.save();
		res.status(201).json({ message: "New user created" });
	} catch (error) {
		console.error("/register error: ", error);
		res.status(500).json({ message: "Something wrong... /api/register" });
	}
});

router.post("/login", [check("email", "Invalid email. An email adress must contain single @").normalizeEmail().isEmail(), check("password", "Invalid password. Password must be at least 6 characters").isLength({ min: 6 })], async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: "Validation errors in login",
			});
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User not found." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Wrong password" });
		}

		const token = jwt.sign({ userId: user.id, type: "access" }, process.env.JWT_TOKEN, { expiresIn: "30s" });

		const refresh_id = uuid();
		const refresh_token = jwt.sign({ id: refresh_id, type: "refresh" }, process.env.JWT_TOKEN, { expiresIn: "1m" });

		const userToken = await Token.findOne({ userId: user.id });

		if (!userToken) {
			const newToken = new Token({
				tokenId: refresh_id,
				userId: user.id,
			});

			await newToken.save();
		} else {
			await userToken.updateOne({ tokenId: refresh_id });
		}

		res.json({ token, refresh_token, userId: user.id, email: user.email, nick: user.nick });
	} catch (error) {
		console.error("/login error: ", error);
		res.status(500).json({ message: "Something wrong... /api/login" });
	}
});

module.exports = router;
