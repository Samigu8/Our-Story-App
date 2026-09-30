const prisma = require("../utils/prisma");

exports.getMemories = async (req, res) => {
  const memories = await prisma.memory.findMany({
    where: { userId: req.user.id },
  });
  res.json(memories);
};

exports.addMemory = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  const memory = await prisma.memory.create({
    data: {
      title,
      description,
      imageUrl,
      userId: req.user.id,
    },
  });

  res.json(memory);
};
