import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { authMiddleware, generateToken } from "../middleware/auth";

const router = Router();

function getDefaultUser() {
  return {
    id: "pm-admin",
    email: process.env.PM_EMAIL || "admin@pm-dashboard.com",
    password: bcrypt.hashSync("admin123", 10),
    name: process.env.PM_NAME || "PM Admin",
  };
}

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = getDefaultUser();
  if (email !== user.email) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get("/me", authMiddleware, (_req: Request, res: Response) => {
  const user = getDefaultUser();
  res.json({ id: user.id, email: user.email, name: user.name });
});

export default router;
