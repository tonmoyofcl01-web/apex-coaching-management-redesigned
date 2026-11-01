import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  ClipboardList, Wallet, ClipboardCheck, ChartNoAxesCombined, Settings
} from "lucide-react";

export const navigation = [
  { label: "Overview", path: "dashboard", icon: LayoutDashboard },
  { label: "Students", path: "students", icon: Users },
  { label: "Teachers", path: "teachers", icon: GraduationCap },
  { label: "Courses", path: "courses", icon: BookOpen },
  { label: "Batches", path: "batches", icon: CalendarDays },
  { label: "Enrollments", path: "enrollments", icon: ClipboardList },
  { label: "Payments", path: "payments", icon: Wallet },
  { label: "Attendance", path: "attendance", icon: ClipboardCheck },
  { label: "Reports", path: "reports", icon: ChartNoAxesCombined },
  { label: "Settings", path: "settings", icon: Settings }
];

export const modules = {
  students: {
    title: "Students", subtitle: "Manage student records and contact information.", id: "STUDENT_ID",
    columns: ["STUDENT_CODE","FULL_NAME","PHONE","EMAIL","STATUS"],
    fields: [
      ["STUDENT_CODE","Student ID","text",true],["FULL_NAME","Full name","text",true],
      ["PHONE","Phone","text",true],["EMAIL","Email","email"],["GUARDIAN_NAME","Guardian name","text"],
      ["GUARDIAN_PHONE","Guardian phone","text"],["DATE_OF_BIRTH","Date of birth","date"],
      ["GENDER","Gender","select",false,["Male","Female","Other"]],
      ["ADDRESS","Address","textarea"],["STATUS","Status","select",false,["ACTIVE","INACTIVE"]]
    ]
  },
  teachers: {
    title: "Teachers", subtitle: "Manage teaching staff and specializations.", id: "TEACHER_ID",
    columns: ["FULL_NAME","PHONE","EMAIL","SPECIALIZATION","STATUS"],
    fields: [["FULL_NAME","Full name","text",true],["PHONE","Phone","text",true],["EMAIL","Email","email"],
      ["SPECIALIZATION","Specialization","text"],["JOIN_DATE","Join date","date"],["STATUS","Status","select",false,["ACTIVE","INACTIVE"]]]
  },
  courses: {
    title: "Courses", subtitle: "Organize courses, durations and tuition fees.", id: "COURSE_ID",
    columns: ["COURSE_NAME","DURATION_MONTHS","COURSE_FEE","STATUS"],
    fields: [["COURSE_NAME","Course name","text",true],["DESCRIPTION","Description","textarea"],
      ["DURATION_MONTHS","Duration (months)","number",true],["COURSE_FEE","Course fee (৳)","number",true],
      ["STATUS","Status","select",false,["ACTIVE","INACTIVE"]]]
  },
  batches: {
    title: "Batches", subtitle: "Schedule batches and assign teachers.", id: "BATCH_ID",
    columns: ["BATCH_NAME","COURSE_ID","TEACHER_ID","SCHEDULE","CAPACITY","STATUS"],
    fields: [["BATCH_NAME","Batch name","text",true],["COURSE_ID","Course","lookup",true,"courses"],
      ["TEACHER_ID","Teacher","lookup",false,"teachers"],["START_DATE","Start date","date"],
      ["END_DATE","End date","date"],["SCHEDULE","Schedule","text"],["CAPACITY","Capacity","number",true],
      ["STATUS","Status","select",false,["ACTIVE","COMPLETED","CANCELLED"]]]
  },
  enrollments: {
    title: "Enrollments", subtitle: "Enroll students into batches and track their fee.", id: "ENROLLMENT_ID",
    columns: ["STUDENT_ID","BATCH_ID","ENROLLMENT_DATE","TOTAL_FEE","STATUS"],
    fields: [["STUDENT_ID","Student","lookup",true,"students"],["BATCH_ID","Batch","lookup",true,"batches"],
      ["ENROLLMENT_DATE","Enrollment date","date"],["TOTAL_FEE","Total fee (৳)","number",true],
      ["STATUS","Status","select",false,["ACTIVE","COMPLETED","CANCELLED"]]]
  },
  payments: {
    title: "Payments", subtitle: "Record tuition payments and review payment history.", id: "PAYMENT_ID",
    columns: ["STUDENT_ID","ENROLLMENT_ID","AMOUNT","PAYMENT_METHOD","PAYMENT_DATE","STATUS"],
    fields: [["STUDENT_ID","Student","lookup",true,"students"],["ENROLLMENT_ID","Enrollment","lookup",false,"enrollments"],
      ["AMOUNT","Amount (৳)","number",true],["PAYMENT_METHOD","Payment method","select",true,["CASH","BKASH","NAGAD","BANK","CARD","OTHER"]],
      ["PAYMENT_DATE","Payment date","date"],["REFERENCE_NO","Reference number","text"],
      ["STATUS","Status","select",false,["PAID","PENDING","REFUNDED"]],["NOTES","Notes","textarea"]]
  },
  attendance: {
    title: "Attendance", subtitle: "Record daily attendance for each batch.", id: "ATTENDANCE_ID",
    columns: ["STUDENT_ID","BATCH_ID","ATTENDANCE_DATE","STATUS","REMARKS"],
    fields: [["STUDENT_ID","Student","lookup",true,"students"],["BATCH_ID","Batch","lookup",true,"batches"],
      ["ATTENDANCE_DATE","Attendance date","date"],["STATUS","Attendance","select",true,["PRESENT","ABSENT","LATE"]],
      ["REMARKS","Remarks","textarea"]]
  }
};
