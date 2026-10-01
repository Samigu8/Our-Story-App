require("dotenv").config({ path: "prisma/.env" });
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const memoryRoutes = require("./routes/memoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/memories", memoryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Our Story API running" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
