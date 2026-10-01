const prisma = require("../utils/prisma");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true, createdAt: true },
  });

  res.json({ message: "User registered", user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({ message: "Login successful", token });
};
