const { Router } = require("express");
const User = require("../models/user");
const Data = require("../models/data");
const router = Router();
const auth = require("../middleware/auth.middleware");

router.get("/get", auth, async (req, res) => {
  try {
    const data = await User.find({ _id: req.user.userId });
    const { main } = await Data.findOne({ name: "coldwar" });
    // ДОБАВЛЕНИЕ НОВЫХ ОРУЖИЙ ИСХОДЯ ИЗ INITAL STATE
    main.forEach((categ, index) => {
      if (categ.weapons.length > data[0].state[index].weapons.length) {
        const numOfNewWeapons =
          categ.weapons.length - data[0].state[index].weapons.length;
        const newWeapons = categ.weapons.slice(-numOfNewWeapons);
        data[0].state[index].weapons = data[0].state[index].weapons.concat(newWeapons);
        return [...data[0].state];
      }
    });
    return res.json(data[0].state);
  } catch (e) {
    console.error("/get error", e);
    return res.status(500).json({ message: "Something wrong... /api/get" });
  }
});

router.post("/sync", auth, async (req, res) => {
  try {
    await syncData(req, res);
  } catch (e) {
    console.error("/sync error: ", e);
    res.status(500).json({ message: "Sync data error" });
  }
});

router.get("/reset", auth, async (req, res) => {
  try {
    await resetData(req, res);
  } catch (e) {
    console.error("/reset error: ", e);
    res.status(500).json({ message: "Reset data error" });
  }
});

async function resetData(req, res) {
  const state = await Data.findOne({ name: "coldwar" });
  if (!state) {
    console.error("Initial state get error");
    return res.status(400).json({ message: "Failed to reset progress." });
  }
  User.findByIdAndUpdate(req.user.userId, { state: state.main }, { new: true })
    .then((user) =>
      res.json({ state: user.state, message: "Progress is reset." })
    )
    .catch((e) => {
      console.error("resetData error: ", e);
      res.status(400).json({ message: "Reset data error... /api/get" });
    });
}

async function syncData(req, res) {
  const state = req.body;
  if (state) {
    User.findByIdAndUpdate(req.user.userId, { state: state })
      .then(() => res.json("Progress is synchronized with the database."))
      .catch((e) => {
        console.error("syncData error: ", e);
        res.status(400).json({ message: "Sync data error... /api/get" });
      });
  }
}

module.exports = router;
