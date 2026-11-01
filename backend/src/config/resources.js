export const resources = {
  students: {
    table: "STUDENTS", id: "STUDENT_ID",
    fields: ["STUDENT_CODE","FULL_NAME","EMAIL","PHONE","GUARDIAN_NAME","GUARDIAN_PHONE","ADDRESS","DATE_OF_BIRTH","GENDER","STATUS"],
    required: ["STUDENT_CODE","FULL_NAME","PHONE"],
    search: ["STUDENT_CODE","FULL_NAME","PHONE","EMAIL"],
    dates: ["DATE_OF_BIRTH"],
    defaults: { STATUS: "ACTIVE" }
  },
  teachers: {
    table: "TEACHERS", id: "TEACHER_ID",
    fields: ["FULL_NAME","EMAIL","PHONE","SPECIALIZATION","JOIN_DATE","STATUS"],
    required: ["FULL_NAME","PHONE"],
    search: ["FULL_NAME","PHONE","EMAIL","SPECIALIZATION"],
    dates: ["JOIN_DATE"],
    defaults: { STATUS: "ACTIVE" }
  },
  courses: {
    table: "COURSES", id: "COURSE_ID",
    fields: ["COURSE_NAME","DESCRIPTION","DURATION_MONTHS","COURSE_FEE","STATUS"],
    required: ["COURSE_NAME","DURATION_MONTHS","COURSE_FEE"],
    search: ["COURSE_NAME","DESCRIPTION"],
    numbers: ["DURATION_MONTHS","COURSE_FEE"],
    defaults: { STATUS: "ACTIVE", DURATION_MONTHS: 1, COURSE_FEE: 0 }
  },
  batches: {
    table: "BATCHES", id: "BATCH_ID",
    fields: ["BATCH_NAME","COURSE_ID","TEACHER_ID","START_DATE","END_DATE","SCHEDULE","CAPACITY","STATUS"],
    required: ["BATCH_NAME","COURSE_ID","CAPACITY"],
    search: ["BATCH_NAME","SCHEDULE"],
    dates: ["START_DATE","END_DATE"],
    numbers: ["COURSE_ID","TEACHER_ID","CAPACITY"],
    defaults: { CAPACITY: 30, STATUS: "ACTIVE" }
  },
  enrollments: {
    table: "ENROLLMENTS", id: "ENROLLMENT_ID",
    fields: ["STUDENT_ID","BATCH_ID","ENROLLMENT_DATE","TOTAL_FEE","STATUS"],
    required: ["STUDENT_ID","BATCH_ID","TOTAL_FEE"],
    search: [],
    dates: ["ENROLLMENT_DATE"],
    numbers: ["STUDENT_ID","BATCH_ID","TOTAL_FEE"],
    defaults: { STATUS: "ACTIVE", TOTAL_FEE: 0 }
  },
  payments: {
    table: "PAYMENTS", id: "PAYMENT_ID",
    fields: ["STUDENT_ID","ENROLLMENT_ID","AMOUNT","PAYMENT_METHOD","PAYMENT_DATE","REFERENCE_NO","STATUS","NOTES"],
    required: ["STUDENT_ID","AMOUNT","PAYMENT_METHOD"],
    search: ["REFERENCE_NO","NOTES"],
    dates: ["PAYMENT_DATE"],
    numbers: ["STUDENT_ID","ENROLLMENT_ID","AMOUNT"],
    defaults: { PAYMENT_METHOD: "CASH", STATUS: "PAID" }
  },
  attendance: {
    table: "ATTENDANCE", id: "ATTENDANCE_ID",
    fields: ["STUDENT_ID","BATCH_ID","ATTENDANCE_DATE","STATUS","REMARKS"],
    required: ["STUDENT_ID","BATCH_ID","STATUS"],
    search: ["REMARKS"],
    dates: ["ATTENDANCE_DATE"],
    numbers: ["STUDENT_ID","BATCH_ID"],
    defaults: { STATUS: "PRESENT" }
  }
};
