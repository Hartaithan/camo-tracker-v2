const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Authentication failed" });
		}

		jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
			if (error) {
				console.log("Authentication token expired");
				return res.status(403).json({ message: "Authentication token expired", isExpired: true });
			}
			req.user = decoded;
			next();
		});
	} catch (e) {
		console.log(e);
		res.status(401).json({ message: "Authentication failed" });
	}
};
