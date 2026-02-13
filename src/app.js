require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const proxyRoutes = require("./routes/proxy.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/auth", authRoutes);
app.use("/proxy", proxyRoutes);
app.use("/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("API Gateway running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Gateway running on port", PORT);
});
