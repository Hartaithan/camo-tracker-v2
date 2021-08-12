const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const auth = require("../middleware/auth.middleware");

router.get("/get", auth, async (req, res) => {
	try {
		const data = await User.find({ _id: req.user.userId });
		return res.json(data[0].state);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Something wrong... /api/get" });
	}
});

router.post("/sync", auth, async (req, res) => {
	try {
		await syncData(req, res);
	} catch (e) {
		console.log("Sync data error: ", e);
		res.status(500).json({ message: "Sync data error" });
	}
});

async function syncData(req, res) {
	const state = req.body;
	if (state) {
		User.findById(req.user.userId)
			.then((user) => {
				user
					.updateOne({ state: state })
					.then(() => res.json("Progress is synchronized with the database."))
					.catch((err) => res.status(400).json({ message: `Sync data error: ${err}` }));
			})
			.catch((err) => {
				console.log("Sync data error: ", err);
				res.status(400).json({ message: "Sync data error... /api/get" });
			});
	}
}

module.exports = router;
