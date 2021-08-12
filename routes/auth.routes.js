const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
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
		console.log("Register error: ", error);
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

		const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, {
			expiresIn: "168h",
		});
		res.json({ token, userId: user.id, nick: user.nick });
	} catch (error) {
		console.log("Register error: ", error);
		res.status(500).json({ message: "Something wrong... /api/login" });
	}
});

module.exports = router;
