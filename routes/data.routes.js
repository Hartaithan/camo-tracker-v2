const { Router } = require("express");
const User = require("../models/user");
const Data = require("../models/data");
const router = Router();
const auth = require("../middleware/auth.middleware");
const appName = require("../middleware/appName.middleware");

router.get("/get", auth, appName, async (req, res) => {
  try {
    const appName = req.headers.appname;
    const data = await User.find({ _id: req.user.userId });
    const { main } = await Data.findOne({ name: appName });
    if (!data || !main) {
      console.error("Failed to get from database.");
      return res.status(400).json({ message: "Failed to get progress." });
    }
    // ДОБАВЛЕНИЕ НОВЫХ ОРУЖИЙ ИСХОДЯ ИЗ INITAL STATE
    main.forEach((categ, index) => {
      if (categ.weapons.length > data[0][appName][index].weapons.length) {
        const numOfNewWeapons =
          categ.weapons.length - data[0][appName][index].weapons.length;
        const newWeapons = categ.weapons.slice(-numOfNewWeapons);
        data[0][appName][index].weapons =
          data[0][appName][index].weapons.concat(newWeapons);
        return [...data[0][appName]];
      }
    });
    return res.json(data[0][appName]);
  } catch (e) {
    console.error("/get error", e);
    return res.status(500).json({ message: "Something wrong... /api/get" });
  }
});

router.get("/demo", appName, async (req, res) => {
  try {
    const appName = req.headers.appname;
    const { main } = await Data.findOne({ name: appName });
    if (!main) {
      console.error("Failed to get from database.");
      return res.status(400).json({ message: "Failed to get progress." });
    }
    return res.json(main);
  } catch (e) {
    console.error("/demo error", e);
    return res.status(500).json({ message: "Something wrong... /api/demo" });
  }
});

router.post("/sync", auth, appName, async (req, res) => {
  try {
    await syncData(req, res);
  } catch (e) {
    console.error("/sync error: ", e);
    res.status(500).json({ message: "Sync data error" });
  }
});

router.get("/reset", auth, appName, async (req, res) => {
  try {
    await resetData(req, res);
  } catch (e) {
    console.error("/reset error: ", e);
    res.status(500).json({ message: "Reset data error" });
  }
});

async function resetData(req, res) {
  const appName = req.headers.appname;
  const state = await Data.findOne({ name: req.headers.appname });
  if (!state) {
    console.error("Initial state get error");
    return res.status(400).json({ message: "Failed to reset progress." });
  }
  User.findByIdAndUpdate(
    req.user.userId,
    { [appName]: state.main },
    { new: true }
  )
    .then((user) =>
      res.json({ state: user[appName], message: "Progress is reset." })
    )
    .catch((e) => {
      console.error("resetData error: ", e);
      res.status(400).json({ message: "Reset data error... /api/get" });
    });
}

async function syncData(req, res) {
  const appName = req.headers.appname;
  const state = req.body;
  if (state) {
    User.findByIdAndUpdate(req.user.userId, { [appName]: state })
      .then(() => res.json("Progress is synchronized with the database."))
      .catch((e) => {
        console.error("syncData error: ", e);
        res.status(400).json({ message: "Sync data error... /api/get" });
      });
  }
}

module.exports = router;
