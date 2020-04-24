const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./users-model");

// User registration
router.post('/register', (req, res) => {
  // This endpoint receives an object, user
  let user = req.body;
  // For local dev, 8 rounds is enough. Higher value in prod.
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);
  // The password value is now the hash generated above
  user.password = hash;

  // Now we add the user to the database
  Users.add(user)
  .then(saved => res.status(201).json(saved))
  .catch(error => res.status(500).json({ errorMessage: error.message }));
});

// User login
router.post('/login', (req, res) => {
  // This endpoint receives credentials object
  let { username, password } = req.body;

  // Search for the user
  Users.findBy({ username })
  .then(user => {
    // Check if user exists and if the password matches
    if(user && bcrypt.compareSync(password, user[0].password)) {
      // If so, generate a token
      const token = generateToken(user);
      // Send the token to the client
      res.status(200).json({ message: "Login successful", username: user[0].username, token });
      // Login failed
    } else {
      res.status(401).json({ message: "Error logging in"})
    }
  })
});

function generateToken(user) {
  // JWT payload (visible info)
  const payload = {
    userId: user[0].id,
    username: user[0].username
  };

  // Use a real secret in production
  const secret = process.env.JWT_SECRET || "justtestinglocally";

  // Token security options
  const options = {
    expiresIn: "1d"
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
