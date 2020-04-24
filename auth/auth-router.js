const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./users-model");

// User registration
router.post('/register', (req, res) => {
  let user = req.body;
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);
  user.password = hash;

  Users.add(user)
  .then(saved => res.status(201).json(saved))
  .catch(error => res.status(500).json({ errorMessage: error.message }));
});

// User login
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
  .then(user => {
    if(user && bcrypt.compareSync(password, user[0].password)) {
      const token = generateToken(user);
      // Send the token to the client
      res.status(200).json({ message: "Login successful", username: user[0].username, token });
    } else {
      res.status(401).json({ message: "Error logging in"})
    }
  })
});

function generateToken(user) {

  const payload = {
    userId: user[0].id,
    username: user[0].username
  };

  const secret = process.env.JWT_SECRET || "justtestinglocally";

  const options = {
    expiresIn: "1d"
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
