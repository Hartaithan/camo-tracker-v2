const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const Data = require("../models/data");
const { generateTokens } = require("../helpers/tokenHelper");
const router = Router();

router.post(
  "/register",
  [
    check(
      "email",
      "Invalid email. An email adress must contain single @"
    ).isEmail(),
    check(
      "password",
      "Invalid password. Password must be at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Validation errors in registration",
        });
      }

      const { email, nick, password } = req.body;

      const emailIsUsed = await User.findOne({ email });
      if (emailIsUsed) {
        return res.status(300).json({ message: "Email is already used." });
      }

      const nickIsUsed = await User.findOne({ nick });
      if (nickIsUsed) {
        return res.status(300).json({ message: "Nickname is already used." });
      }

      const coldwar = await Data.findOne({ name: "coldwar" });
      const vanguard = await Data.findOne({ name: "vanguard" });
      if (!coldwar || !vanguard) {
        console.error("Initial state not found");
        return res.status(400).json({ message: "Failed to create a user." });
      }

      const hashedPass = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        nick,
        password: hashedPass,
        coldwar: coldwar.main,
        vanguard: vanguard.main,
      });

      await newUser.save();
      res.status(201).json({ message: "New user created" });
    } catch (error) {
      console.error("/register error: ", error);
      res.status(500).json({ message: "Something wrong... /api/register" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Invalid email. An email adress must contain single @")
      .normalizeEmail()
      .isEmail(),
    check(
      "password",
      "Invalid password. Password must be at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
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

      generateTokens(user.id).then(({ token, refresh_token }) =>
        res.json({
          token,
          refresh_token,
          userId: user.id,
          email: user.email,
          nick: user.nick,
        })
      );
    } catch (error) {
      console.error("/login error: ", error);
      res.status(500).json({ message: "Something wrong... /api/login" });
    }
  }
);

module.exports = router;
