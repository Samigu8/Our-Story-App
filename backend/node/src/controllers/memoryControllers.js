const prisma = require("../utils/prisma");
const cloudinary = require("../config/cloudinary");

exports.getMemories = async (req, res) => {
  const memories = await prisma.memory.findMany({
    where: { userId: req.user.id },
  });
  res.json(memories);
};

exports.addMemory = async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required",
        field: "image",
        message: "Send the request as multipart/form-data and attach the file using the image field.",
      });
    }

    // Convert buffer to base64 string for Cloudinary's upload API.
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "our-story",
    });

    const imageUrl = result.secure_url;

    const memory = await prisma.memory.create({
      data: {
        title,
        description,
        imageUrl,
        userId: req.user.id,
      },
    });

    res.json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};