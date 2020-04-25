const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "justtestinglocally";

  // Verify token if it exists
  token ? jwt.verify(token, secret, (error, decodedToken) => {
    if(error) {
      res.status(401).json({ message: "Cannot authenticate" });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  })
  : res.status(400).json({ message: "You must be authenticated" });
};
