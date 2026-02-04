import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import summaryRoutes from "./routes/RouteSummary.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);
app.use("/api", summaryRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
