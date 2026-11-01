import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";

import {
  login,
  me,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import {
  list,
  getById,
  create,
  update,
  remove,
} from "../controllers/resourceController.js";

import { dashboard } from "../controllers/dashboardController.js";
import { query } from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Authentication
router.post("/auth/login", asyncHandler(login));

router.use(requireAuth);

router.get("/auth/me", asyncHandler(me));
router.put("/auth/profile", asyncHandler(updateProfile));
router.put("/auth/password", asyncHandler(changePassword));

// Dashboard
router.get("/dashboard", asyncHandler(dashboard));

// Lookup: Students
router.get(
  "/lookups/students",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT STUDENT_ID AS ID, FULL_NAME AS LABEL
       FROM STUDENTS
       WHERE STATUS = 'ACTIVE'
       ORDER BY FULL_NAME`,
    );

    res.json(result.rows);
  }),
);

// Lookup: Teachers
router.get(
  "/lookups/teachers",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT TEACHER_ID AS ID, FULL_NAME AS LABEL
       FROM TEACHERS
       WHERE STATUS = 'ACTIVE'
       ORDER BY FULL_NAME`,
    );

    res.json(result.rows);
  }),
);

// Lookup: Courses
router.get(
  "/lookups/courses",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT COURSE_ID AS ID, COURSE_NAME AS LABEL
       FROM COURSES
       WHERE STATUS = 'ACTIVE'
       ORDER BY COURSE_NAME`,
    );

    res.json(result.rows);
  }),
);

// Lookup: Batches
router.get(
  "/lookups/batches",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT BATCH_ID AS ID, BATCH_NAME AS LABEL
       FROM BATCHES
       WHERE STATUS = 'ACTIVE'
       ORDER BY BATCH_NAME`,
    );

    res.json(result.rows);
  }),
);

// Lookup: Enrollments
router.get(
  "/lookups/enrollments",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT
         E.ENROLLMENT_ID AS ID,
         'Enrollment #' || E.ENROLLMENT_ID ||
         ' - ' || S.FULL_NAME ||
         ' (' || B.BATCH_NAME || ')' AS LABEL
       FROM ENROLLMENTS E
       INNER JOIN STUDENTS S
         ON E.STUDENT_ID = S.STUDENT_ID
       INNER JOIN BATCHES B
         ON E.BATCH_ID = B.BATCH_ID
       ORDER BY E.ENROLLMENT_ID DESC`,
    );

    res.json(result.rows);
  }),
);

// Reports
router.get(
  "/reports/summary",
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT 'Students' AS CATEGORY, COUNT(*) AS TOTAL FROM STUDENTS
      UNION ALL SELECT 'Teachers', COUNT(*) FROM TEACHERS
      UNION ALL SELECT 'Courses', COUNT(*) FROM COURSES
      UNION ALL SELECT 'Batches', COUNT(*) FROM BATCHES
      UNION ALL SELECT 'Enrollments', COUNT(*) FROM ENROLLMENTS
      UNION ALL SELECT 'Payments', COUNT(*) FROM PAYMENTS
    `);

    res.json(result.rows);
  }),
);

// Resource CRUD endpoints
router.get("/:resource", asyncHandler(list));
router.get("/:resource/:id", asyncHandler(getById));

router.post("/:resource", asyncHandler(create));
router.put("/:resource/:id", asyncHandler(update));
router.delete("/:resource/:id", asyncHandler(remove));

export default router;
