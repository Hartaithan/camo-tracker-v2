module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (req.headers.appname) {
      return next();
    } else {
      console.error("appName header not found.");
      return res.status(400).json({ message: "appName header not found." });
    }
  } catch (e) {
    console.error("appName.middleware catch (error)", e);
    res.status(401).json({ message: "Something wrong... appName.middleware" });
  }
};
