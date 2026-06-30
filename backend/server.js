import express from "express";
import mongoose from "mongoose";
import config from "./.config/config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js"; // Single, correct import
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());
// --- API Routes ---
app.get("/", (req, res) => {
  res.send("API is running...");
}
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes); // Use the routes once


// --- Database Connection ---
if (!config.MONGO_URL) {
  console.error("❌ MongoDB connection error: MONGO_URL is missing.");
  process.exit(1);
}

mongoose.connect(config.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("🔒 CORS Allowed Origins:", config.ALLOWED_ORIGINS);
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
);