const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authControllers");
const { validateBody, authSchema } = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiters");

router.post("/register", validateBody(authSchema), register);
router.post("/login", loginLimiter, validateBody(authSchema), login);

module.exports = router;
