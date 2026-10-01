const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { getMemories, addMemory } = require("../controllers/memoryControllers");

router.get("/", auth, getMemories);
router.post("/", auth, upload.single("image"), addMemory);

module.exports = router;
