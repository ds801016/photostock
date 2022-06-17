const protect = (req, res, next) => {
  if (req.session.userId == null) {
    res.send({ user: null });
    throw new Error("Please Log in first");
  } else {
    next();
  }
};

module.exports = protect;
