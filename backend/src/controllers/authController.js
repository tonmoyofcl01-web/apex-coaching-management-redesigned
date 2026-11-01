import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { query } from "../config/database.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
});

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter a valid email and password.",
    });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const result = await query(
    `SELECT ADMIN_ID, FULL_NAME, EMAIL, PASSWORD_HASH
     FROM ADMINS
     WHERE LOWER(EMAIL) = :email`,
    { email },
  );

  const admin = result.rows[0];

  if (
    !admin ||
    !(await bcrypt.compare(parsed.data.password, admin.PASSWORD_HASH))
  ) {
    return res.status(401).json({
      message: "Incorrect email or password.",
    });
  }

  const token = jwt.sign(
    {
      id: admin.ADMIN_ID,
      email: admin.EMAIL,
      name: admin.FULL_NAME,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  res.json({
    token,
    admin: {
      id: admin.ADMIN_ID,
      name: admin.FULL_NAME,
      email: admin.EMAIL,
    },
  });
}

export async function me(req, res) {
  const result = await query(
    `SELECT ADMIN_ID, FULL_NAME, EMAIL
     FROM ADMINS
     WHERE ADMIN_ID = :id`,
    { id: req.admin.id },
  );

  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Admin account not found.",
    });
  }

  const row = result.rows[0];

  res.json({
    id: row.ADMIN_ID,
    name: row.FULL_NAME,
    email: row.EMAIL,
  });
}

export async function updateProfile(req, res) {
  const parsed = profileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter a valid name and email address.",
    });
  }

  const name = parsed.data.name;
  const email = parsed.data.email.toLowerCase();
  const adminId = req.admin.id;

  // Check whether another administrator already uses this email.
  const existing = await query(
    `SELECT ADMIN_ID
     FROM ADMINS
     WHERE LOWER(EMAIL) = :email
       AND ADMIN_ID <> :id`,
    { email, id: adminId },
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({
      message: "This email address is already registered.",
    });
  }

  try {
    await query(
      `UPDATE ADMINS
       SET FULL_NAME = :name,
           EMAIL = :email
       WHERE ADMIN_ID = :id`,
      { name, email, id: adminId },
      { autoCommit: true },
    );
  } catch (error) {
    // Handle a duplicate email constraint violation.
    if (error.errorNum === 1) {
      return res.status(409).json({
        message: "This email address is already registered.",
      });
    }

    throw error;
  }

  // Generate a fresh token containing the updated profile information.
  const token = jwt.sign(
    {
      id: adminId,
      email,
      name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  res.json({
    message: "Profile updated successfully.",
    token,
    admin: {
      id: adminId,
      name,
      email,
    },
  });
}

export async function changePassword(req, res) {
  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "New password must contain at least 8 characters.",
    });
  }

  const result = await query(
    "SELECT PASSWORD_HASH FROM ADMINS WHERE ADMIN_ID = :id",
    { id: req.admin.id },
  );

  if (
    !result.rows[0] ||
    !(await bcrypt.compare(currentPassword, result.rows[0].PASSWORD_HASH))
  ) {
    return res.status(400).json({
      message: "Current password is incorrect.",
    });
  }

  const hash = await bcrypt.hash(newPassword, 12);

  await query(
    "UPDATE ADMINS SET PASSWORD_HASH = :hash WHERE ADMIN_ID = :id",
    { hash, id: req.admin.id },
    { autoCommit: true },
  );

  res.json({
    message:
      "Password changed successfully. Sign in again if your session expires.",
  });
}
