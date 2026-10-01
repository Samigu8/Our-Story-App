require("dotenv").config({ path: "prisma/.env" });
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const { timelineRoutes, loveNoteRoutes, photoRoutes } = require("./routes/storyRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const auth = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/memories", memoryRoutes);
app.use("/timeline", auth, timelineRoutes);
app.use("/lovenotes", auth, loveNoteRoutes);
app.use("/memories/photos", auth, photoRoutes);
app.use("/uploads", auth, uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Our Story API running" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
