const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => bcrypt.hash(password, 10);

exports.comparePassword = async (password, hashed) =>
  bcrypt.compare(password, hashed);

exports.generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
