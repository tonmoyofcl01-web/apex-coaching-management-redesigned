import { query } from "../config/database.js";

export async function dashboard(req, res) {
  const [students, teachers, courses, batches, revenue, outstanding, recentStudents, recentPayments, monthly] = await Promise.all([
    query("SELECT COUNT(*) AS TOTAL FROM STUDENTS"),
    query("SELECT COUNT(*) AS TOTAL FROM TEACHERS"),
    query("SELECT COUNT(*) AS TOTAL FROM COURSES"),
    query("SELECT COUNT(*) AS TOTAL FROM BATCHES"),
    query("SELECT NVL(SUM(AMOUNT),0) AS TOTAL FROM PAYMENTS WHERE STATUS = 'PAID'"),
    query("SELECT NVL(SUM(E.TOTAL_FEE - NVL(P.PAID,0)),0) AS TOTAL FROM ENROLLMENTS E LEFT JOIN (SELECT ENROLLMENT_ID, SUM(AMOUNT) PAID FROM PAYMENTS WHERE STATUS='PAID' GROUP BY ENROLLMENT_ID) P ON P.ENROLLMENT_ID=E.ENROLLMENT_ID WHERE E.STATUS='ACTIVE'"),
    query("SELECT STUDENT_ID, STUDENT_CODE, FULL_NAME, PHONE, STATUS, CREATED_AT FROM STUDENTS ORDER BY STUDENT_ID DESC FETCH FIRST 5 ROWS ONLY"),
    query("SELECT P.PAYMENT_ID, S.FULL_NAME, P.AMOUNT, P.PAYMENT_METHOD, P.PAYMENT_DATE, P.STATUS FROM PAYMENTS P JOIN STUDENTS S ON S.STUDENT_ID=P.STUDENT_ID ORDER BY P.PAYMENT_ID DESC FETCH FIRST 5 ROWS ONLY"),
    query("SELECT TO_CHAR(PAYMENT_DATE,'Mon YYYY') AS MONTH, SUM(AMOUNT) AS REVENUE FROM PAYMENTS WHERE STATUS='PAID' AND PAYMENT_DATE >= ADD_MONTHS(TRUNC(SYSDATE,'MM'),-5) GROUP BY TO_CHAR(PAYMENT_DATE,'Mon YYYY'), TRUNC(PAYMENT_DATE,'MM') ORDER BY TRUNC(PAYMENT_DATE,'MM')")
  ]);
  res.json({
    stats: {
      students: students.rows[0].TOTAL,
      teachers: teachers.rows[0].TOTAL,
      courses: courses.rows[0].TOTAL,
      batches: batches.rows[0].TOTAL,
      revenue: revenue.rows[0].TOTAL,
      outstanding: outstanding.rows[0].TOTAL
    },
    recentStudents: recentStudents.rows,
    recentPayments: recentPayments.rows,
    monthlyRevenue: monthly.rows
  });
}
