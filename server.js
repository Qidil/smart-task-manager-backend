const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const verifyToken = require("./middleware/authMiddleware");
const { sequelize } = require("./models");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Smart Task Manager API running");
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Akses berhasil!",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
}).catch((err) => {
    console.error("Error syncing database:", err);
});