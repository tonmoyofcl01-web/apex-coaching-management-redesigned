import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import apiRouter from "./routes/api.js";
import { initializePool, query, closePool } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "Apex Coaching API" }));
app.use("/api", apiRouter);
app.use(errorHandler);

async function seedAdmin() {
  const email = "admin@apexcoaching.com";
  const found = await query("SELECT ADMIN_ID FROM ADMINS WHERE LOWER(EMAIL)=LOWER(:email)", { email });
  if (!found.rows.length) {
    const hash = await bcrypt.hash("Admin@12345", 12);
    await query(
      "INSERT INTO ADMINS (FULL_NAME, EMAIL, PASSWORD_HASH) VALUES (:name, :email, :hash)",
      { name: "System Administrator", email, hash },
      { autoCommit: true }
    );
    console.log("Demo administrator created: admin@apexcoaching.com");
  }
}

const port = Number(process.env.PORT) || 5000;
try {
  await initializePool();
  await query("SELECT 1 AS READY FROM DUAL");
  await seedAdmin();
  app.listen(port, () => console.log(`Apex Coaching API running at http://localhost:${port}`));
} catch (error) {
  console.error("Could not start API. Check backend/.env and confirm that the Oracle PDB service is running.");
  console.error(error.message);
  process.exit(1);
}

process.on("SIGINT", async () => { await closePool(); process.exit(0); });
process.on("SIGTERM", async () => { await closePool(); process.exit(0); });
