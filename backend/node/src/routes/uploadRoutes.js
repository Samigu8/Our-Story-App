const express = require("express");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { validateBody, uploadSchema } = require("../middleware/validate");

const router = express.Router();
const allowedFolders = new Set(["timeline", "memories"]);

router.post("/", upload.single("file"), validateBody(uploadSchema), async (req, res) => {
  const folder = typeof req.body.folder === "string" ? req.body.folder.trim().toLowerCase() : "";
  if (!allowedFolders.has(folder)) {
    return res.status(400).json({ message: "Upload folder must be timeline or memories." });
  }
  if (!req.file || !req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "An image file is required." });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: `our-story/${folder}` }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    return res.status(201).json({ fileUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to upload image right now." });
  }
});

module.exports = router;