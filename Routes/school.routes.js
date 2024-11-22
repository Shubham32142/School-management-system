import { upload } from "../middleware/multer.middleware.js";
import {
  createStudent,
  createTeacher,
  createClass,
  getStudents,
  getTeachers,
  getClasses,
  getStudentById,
  assignTeacherToClass,
  updateStudent,
  updateTeacher,
  updateClass,
  softDeleteStudent,
  softDeleteTeacher,
  deleteClass,
  softRestoreStudent,
  softRestoreTeacher,
  getTeacherById,
  markAttendance,
  getAttendanceByClass,
  getAttendanceByStudent,
  registerAdmin,
  loginAdmin,
} from "../Controller/school.controller.js";
import { protect } from "../middleware/authMiddleware.js";
export function Routes(server) {
  server.post("/auth/register", registerAdmin); // Register a new admin
  server.post("/auth/login", loginAdmin);
  server.post(
    "/create/student",
    protect,
    upload.single("profileImageUrl"),
    createStudent
  );
  server.post(
    "/create/teacher",
    protect,
    upload.single("profileImageUrl"),
    createTeacher
  );
  server.post("/create/class", protect, createClass);
  server.post("/attendance", protect, markAttendance);
  server.get("/students", protect, getStudents);
  server.get("/teachers", protect, getTeachers);
  server.get("/classes", protect, getClasses);
  server.get("/student/:id", protect, getStudentById);
  server.get("/teacher/:id", protect, getTeacherById);
  server.get("/attendance/student/:studentId", protect, getAttendanceByStudent); // Get attendance for a student
  server.get("/attendance/class/:classId", protect, getAttendanceByClass); //get attendance for a class
  server.put("/assign-teacher", protect, assignTeacherToClass); //provide class id and teacher id in the body
  server.put(
    "/students/:id",
    protect,
    upload.single("profileImageUrl"),
    updateStudent
  );
  server.put(
    "/teachers/:id",
    protect,
    upload.single("profileImageUrl"),
    updateTeacher
  );
  server.put("/class/:id", protect, updateClass);
  server.delete("/student/delete/:id", protect, softDeleteStudent);
  server.delete("/teacher/delete/:id", protect, softDeleteTeacher);
  server.delete("/class/delete/:id", protect, deleteClass);
  server.patch("/student/restore/:id", protect, softRestoreStudent);
  server.patch("/teacher/restore/:id", protect, softRestoreTeacher);
}
