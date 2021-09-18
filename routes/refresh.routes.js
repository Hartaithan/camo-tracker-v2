const { Router } = require("express");
const Token = require("../models/token");
const router = Router();
const auth = require("../middleware/auth.middleware");

router.post("/refresh", auth, async (req, res) => {
	try {
    
	} catch (e) {
		console.error("/refresh error: ", e);
		res.status(500).json({ message: "Refresh token error" });
	}
});

module.exports = router;