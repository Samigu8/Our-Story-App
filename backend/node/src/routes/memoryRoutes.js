const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { getMemories, addMemory } = require("../controllers/memoryControllers");
const { validateBody, memorySchema } = require("../middleware/validate");

router.get("/", auth, getMemories);
router.post("/", auth, upload.single("image"), validateBody(memorySchema), addMemory);

module.exports = router;
