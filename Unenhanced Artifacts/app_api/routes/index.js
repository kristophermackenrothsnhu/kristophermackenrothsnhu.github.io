const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens 

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

router
.route("/trips")
.get(tripsController.tripsList)
.post(authenticateJWT, tripsController.tripsAddTrip);

router
.route("/trips/:tripCode")
.get(tripsController.tripsFindByCode)
.put(authenticateJWT, tripsController.tripsUpdateTrip);

router.route('/login').post(authController.login);

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (authHeader == null) {
    console.log('Auth Header required but NOT PRESENT!');
    return res.sendStatus(401);
  }

  const headers = authHeader.split(' ');
  if (headers.length < 1) {
    console.log('Not enough tokens in Auth Header: ' + headers.length);
    return res.sendStatus(501);
  }

  const token = headers[1];
  if (token == null) {
    console.log('Null Bearer Token');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      return res.status(401).json('Token Validation Error!');
    }

    req.auth = verified; // Set the auth param to the decoded object
    next(); // Continue or request will hang
  });
}

module.exports = router;