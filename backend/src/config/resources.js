export const resources = {
  students: {
    table: "STUDENTS",
    id: "STUDENT_ID",
    fields: [
      "STUDENT_CODE",
      "FULL_NAME",
      "EMAIL",
      "PHONE",
      "GUARDIAN_NAME",
      "GUARDIAN_PHONE",
      "ADDRESS",
      "DATE_OF_BIRTH",
      "GENDER",
      "STATUS",
    ],
    required: ["STUDENT_CODE", "FULL_NAME", "PHONE"],
    search: ["STUDENT_CODE", "FULL_NAME", "PHONE", "EMAIL"],
    dates: ["DATE_OF_BIRTH"],
    defaults: { STATUS: "ACTIVE" },
  },

  teachers: {
    table: "TEACHERS",
    id: "TEACHER_ID",
    fields: [
      "FULL_NAME",
      "EMAIL",
      "PHONE",
      "SPECIALIZATION",
      "JOIN_DATE",
      "STATUS",
    ],
    required: ["FULL_NAME", "PHONE"],
    search: ["FULL_NAME", "PHONE", "EMAIL", "SPECIALIZATION"],
    dates: ["JOIN_DATE"],
    defaults: { STATUS: "ACTIVE" },
  },

  courses: {
    table: "COURSES",
    id: "COURSE_ID",
    fields: [
      "COURSE_NAME",
      "DESCRIPTION",
      "DURATION_MONTHS",
      "COURSE_FEE",
      "STATUS",
    ],
    required: ["COURSE_NAME", "DURATION_MONTHS", "COURSE_FEE"],
    search: ["COURSE_NAME", "DESCRIPTION"],
    numbers: ["DURATION_MONTHS", "COURSE_FEE"],
    defaults: {
      STATUS: "ACTIVE",
      DURATION_MONTHS: 1,
      COURSE_FEE: 0,
    },
  },

  batches: {
    table: "BATCHES",
    id: "BATCH_ID",
    from: `BATCHES B
      LEFT JOIN COURSES C ON B.COURSE_ID = C.COURSE_ID
      LEFT JOIN TEACHERS T ON B.TEACHER_ID = T.TEACHER_ID`,
    select: `B.*,
      C.COURSE_NAME AS COURSE_NAME,
      T.FULL_NAME AS TEACHER_NAME`,
    orderBy: "B.BATCH_ID",
    fields: [
      "BATCH_NAME",
      "COURSE_ID",
      "TEACHER_ID",
      "START_DATE",
      "END_DATE",
      "SCHEDULE",
      "CAPACITY",
      "STATUS",
    ],
    required: ["BATCH_NAME", "COURSE_ID", "CAPACITY"],
    search: ["B.BATCH_NAME", "B.SCHEDULE", "C.COURSE_NAME", "T.FULL_NAME"],
    dates: ["START_DATE", "END_DATE"],
    numbers: ["COURSE_ID", "TEACHER_ID", "CAPACITY"],
    defaults: {
      CAPACITY: 30,
      STATUS: "ACTIVE",
    },
  },

  enrollments: {
    table: "ENROLLMENTS",
    id: "ENROLLMENT_ID",
    from: `ENROLLMENTS E
      INNER JOIN STUDENTS S ON E.STUDENT_ID = S.STUDENT_ID
      INNER JOIN BATCHES B ON E.BATCH_ID = B.BATCH_ID
      LEFT JOIN COURSES C ON B.COURSE_ID = C.COURSE_ID`,
    select: `E.*,
      S.FULL_NAME AS STUDENT_NAME,
      S.STUDENT_CODE AS STUDENT_CODE,
      B.BATCH_NAME AS BATCH_NAME,
      C.COURSE_NAME AS COURSE_NAME`,
    orderBy: "E.ENROLLMENT_ID",
    fields: [
      "STUDENT_ID",
      "BATCH_ID",
      "ENROLLMENT_DATE",
      "TOTAL_FEE",
      "STATUS",
    ],
    required: ["STUDENT_ID", "BATCH_ID", "TOTAL_FEE"],
    search: ["S.FULL_NAME", "S.STUDENT_CODE", "B.BATCH_NAME", "C.COURSE_NAME"],
    dates: ["ENROLLMENT_DATE"],
    numbers: ["STUDENT_ID", "BATCH_ID", "TOTAL_FEE"],
    defaults: {
      STATUS: "ACTIVE",
      TOTAL_FEE: 0,
    },
  },

  payments: {
    table: "PAYMENTS",
    id: "PAYMENT_ID",
    from: `PAYMENTS P
      INNER JOIN STUDENTS S ON P.STUDENT_ID = S.STUDENT_ID
      LEFT JOIN ENROLLMENTS E ON P.ENROLLMENT_ID = E.ENROLLMENT_ID
      LEFT JOIN BATCHES B ON E.BATCH_ID = B.BATCH_ID`,
    select: `P.*,
      S.FULL_NAME AS STUDENT_NAME,
      S.STUDENT_CODE AS STUDENT_CODE,
      B.BATCH_NAME AS BATCH_NAME`,
    orderBy: "P.PAYMENT_ID",
    fields: [
      "STUDENT_ID",
      "ENROLLMENT_ID",
      "AMOUNT",
      "PAYMENT_METHOD",
      "PAYMENT_DATE",
      "REFERENCE_NO",
      "STATUS",
      "NOTES",
    ],
    required: ["STUDENT_ID", "AMOUNT", "PAYMENT_METHOD"],
    search: [
      "S.FULL_NAME",
      "S.STUDENT_CODE",
      "B.BATCH_NAME",
      "P.REFERENCE_NO",
      "P.NOTES",
    ],
    dates: ["PAYMENT_DATE"],
    numbers: ["STUDENT_ID", "ENROLLMENT_ID", "AMOUNT"],
    defaults: {
      PAYMENT_METHOD: "CASH",
      STATUS: "PAID",
    },
  },

  attendance: {
    table: "ATTENDANCE",
    id: "ATTENDANCE_ID",
    from: `ATTENDANCE A
      INNER JOIN STUDENTS S ON A.STUDENT_ID = S.STUDENT_ID
      INNER JOIN BATCHES B ON A.BATCH_ID = B.BATCH_ID`,
    select: `A.*,
      S.FULL_NAME AS STUDENT_NAME,
      S.STUDENT_CODE AS STUDENT_CODE,
      B.BATCH_NAME AS BATCH_NAME`,
    orderBy: "A.ATTENDANCE_ID",
    fields: ["STUDENT_ID", "BATCH_ID", "ATTENDANCE_DATE", "STATUS", "REMARKS"],
    required: ["STUDENT_ID", "BATCH_ID", "STATUS"],
    search: ["S.FULL_NAME", "S.STUDENT_CODE", "B.BATCH_NAME", "A.REMARKS"],
    dates: ["ATTENDANCE_DATE"],
    numbers: ["STUDENT_ID", "BATCH_ID"],
    defaults: { STATUS: "PRESENT" },
  },
};
