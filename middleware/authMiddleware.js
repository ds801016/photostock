const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  if (req.session.userId == null) {
    // res.send({ user: null });
    throw new Error("Please Log in first");
  } else {
    next();
  }
};

const jwtProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const jwtToken = authHeader.split(" ")[1];
    if (authHeader.split(" ")[0] === "Bearer") {
      const decodedToken = jwt.verify(jwtToken, process.env.JWTSECRET);
      console.log(decodedToken);
      if (decodedToken?.userId) {
        req.user = decodedToken;
        next();
      }
    } else {
      res.json({ status: 500, message: "Login session is invalid!!" });
    }
  } else {
    res.json({ status: 500, message: "Please Log in first!!" });
  }
};

module.exports = { protect, jwtProtect };
