const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // Use a real secret in production
  const secret = process.env.JWT_SECRET || "justtestinglocally";

  // If token exists, verify it
  token ? jwt.verify(token, secret, (error, decodedToken) => {
    // Auth failure
    if(error) {
      res.status(401).json({ message: "Cannot authenticate" });
    } else {
      // Auth successful, allow access
      req.decodedToken = decodedToken;
      next();
    }
  })
  // If no token exists
  : res.status(400).json({ message: "You must be authenticated" });
};
