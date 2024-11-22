import {
  Teacher,
  Student,
  Class,
  Attendance,
  user,
} from "../Model/school.model.js";
import dotenv from "dotenv";
dotenv.config();
import uploadOnCloud from "../utils/cloudinary.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//create student controller
export async function createStudent(req, res) {
  const { name, email, classId } = req.body;
  try {
    if (!name || !email || !classId) {
      return res
        .status(400)
        .json({ message: "Name, email, and classId are required." });
    }
    //check if class exist
    const classExist = await Class.findById(classId);
    if (!classExist) {
      return res
        .status(400)
        .json({ message: "Invalid classId. class does not exist." });
    }
    const profileImageUrl = req.file
      ? await uploadOnCloud(req.file.path, "students")
      : null;

    //create a new student
    const newStudent = new Student({
      name,
      email,
      classId,
      profileImageUrl,
    });
    // save Student to database
    const saveStudent = await newStudent.save();
    //update the student count on a class
    await Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } });
    res
      .status(201)
      .json({ message: "Student created successfully.", student: saveStudent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error creating student.", error: err.message });
  }
}

//create teacher controller
export async function createTeacher(req, res) {
  const { name, email, subject } = req.body;
  try {
    if (!name || !email || !subject) {
      res.status(400).json({ message: "Name, email and subject is required" });
    }
    const profileImageUrl = req.file
      ? await uploadOnCloud(req.file.path, "teachers")
      : null;
    const newTeacher = new Teacher({
      name,
      email,
      subject,
      profileImageUrl,
    });
    const saveTeacher = await newTeacher.save();
    res
      .status(201)
      .json({ message: "Teacher created successfully", teacher: saveTeacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error creating teacher.", error: error.message });
  }
}

//create class controller
export async function createClass(req, res) {
  const { name, teacherId } = req.body;
  try {
    if (!name || !teacherId) {
      return res
        .status(400)
        .json({ message: "Name and teacherId is required" });
    }
    const newClass = new Class({
      name,
      teacherId,
      studentCount: 0,
    });

    const saveClass = await newClass.save();
    res
      .status(201)
      .json({ message: "Class created successfully", class: saveClass });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating the class.", error: error.message });
  }
}

//get all students with pagination and filtering by class
export async function getStudents(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // default set it to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; //default set it to 10 items per page
    const skip = (page - 1) * pageSize;
    //geting class for filtering
    const classId = req.query.classId;
    //query object
    const query = { deleted: false };
    if (classId) {
      query.classId = classId;
    }

    //finding students with pagination and filtering

    const students = await Student.find(query)
      .populate("classId")
      .skip(skip)
      .limit(pageSize)
      .exec();

    // to get the total count of students for pagination
    const totalStudents = await Student.countDocuments(query);

    res.status(200).json({
      message: "Students retrieved successfully",
      students,
      totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / pageSize),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving students", error: error.message });
  }
}

//get teacher with pagination

export async function getTeachers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // default set it to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; //default set it to 10 items per page
    const skip = (page - 1) * pageSize;

    const query = { deleted: false };
    //fetch teacher with pagination
    const teachers = await Teacher.find(query)
      .skip(skip)
      .limit(pageSize)
      .exec();

    //total count of pagination
    const totalTeachers = await Teacher.countDocuments(query);

    res.status(200).json({
      message: "Teachers retrieved successfully",
      teachers,
      totalTeachers,
      currentPage: page,
      totalPages: Math.ceil(totalTeachers / pageSize),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Teachers", error: error.message });
  }
}

//get classes with pagination
export async function getClasses(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // default set it to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; //default set it to 10 items per page
    const skip = (page - 1) * pageSize;
    //fetch teacher with pagination
    const classes = await Class.find().skip(skip).limit(pageSize).exec();

    //total count of pagination
    const totalClasses = await Class.countDocuments();

    res.status(200).json({
      message: "Classes retrieved successfully",
      classes,
      totalClasses,
      currentPage: page,
      totalPages: Math.ceil(totalClasses / pageSize),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Classes", error: error.message });
  }
}

//get single student by id

export async function getStudentById(req, res) {
  const { id } = req.params;
  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    //fetch the student by id
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //response with retrieved students
    res
      .status(200)
      .json({ message: "Student retrieved Successfully", Student: student });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving the Student", error: err.message });
  }
}

//get teacher by id
export async function getTeacherById(req, res) {
  const { id } = req.params;
  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Teacher ID format" });
    }
    //fetch the student by id
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    //response with retrieved students
    res
      .status(200)
      .json({ message: "Teacher retrieved Successfully", Teacher: teacher });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving the Teacher", error: err.message });
  }
}

//Assign a teacher to a class

export async function assignTeacherToClass(req, res) {
  const { classId, teacherId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid Class ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid Teacher ID format" });
    }
    //check if class exist
    const classExist = await Class.findById(classId);
    if (!classExist) {
      return res.status(404).json({ message: "class not found" });
    }
    //check if teacher exist
    const teacherExist = await Teacher.findById(teacherId);
    if (!teacherExist) {
      return res.status(404).json({ message: "teacher not found" });
    }
    //update the class with teacherID
    classExist.teacherId = teacherId;
    const updatedClass = await classExist.save();
    res.status(200).json({
      message: "Teacher assigned to class",
      class: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning teacher to a class",
      error: error.message,
    });
  }
}

//update a student
export async function updateStudent(req, res) {
  const { id } = req.params;
  const { name, classId, email } = req.body;
  const profileImageUrl = req.file ? req.file.path : undefined;
  try {
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    //using updateData dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (classId) updateData.classId = classId;
    if (email) updateData.email = email;
    if (profileImageUrl)
      updateData.profileImageUrl = await uploadOnCloud(
        profileImageUrl,
        "students"
      );

    //update the student
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "student does not exist" });
    }
    res.status(200).json({
      message: "Student details updated Successfully",
      updatedStudent: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating student details",
      error: error.message,
    });
  }
}

//update a student
export async function updateTeacher(req, res) {
  const { id } = req.params;
  const { name, subject, email } = req.body;
  const profileImageUrl = req.file ? req.file.path : undefined;
  try {
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    //using updateData dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (email) updateData.email = email;
    if (profileImageUrl)
      updateData.profileImageUrl = await uploadOnCloud(
        profileImageUrl,
        "teachers"
      );

    //update the teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher does not exist" });
    }
    res.status(200).json({
      message: "Teacher details updated Successfully",
      updatedTeacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Teacher details",
      error: error.message,
    });
  }
}

//update Class
export async function updateClass(req, res) {
  const { id } = req.params;
  const { name, teacherId } = req.body;
  try {
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    //checking teacher Id if provided
    if (teacherId && !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    //using updateData dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (teacherId) updateData.teacherId = teacherId;

    //update the class
    const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedClass) {
      return res.status(404).json({ message: "Class does not exist" });
    }
    res.status(200).json({
      message: "Teacher details updated Successfully",
      updatedClass: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Class details",
      error: error.message,
    });
  }
}

//soft delete students
export async function softDeleteStudent(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // Soft delete the student
    const student = await Student.findByIdAndUpdate(
      id,
      { deleted: true }, // Set the deleted flag to true
      { new: true } // Return the updated document
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student soft deleted successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error soft deleting student",
      error: error.message,
    });
  }
}

//soft delete teachers
export async function softDeleteTeacher(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    // Soft delete the student
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { deleted: true }, // Set the deleted flag to true
      { new: true } // Return the updated document
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher soft deleted successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error soft deleting teacher",
      error: error.message,
    });
  }
}

export async function deleteClass(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID format" });
    }
    // Checking if class exists
    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    //delete class
    const deletedClass = await Class.findByIdAndDelete(id);
    res.status(200).json({
      message: "Class deleted successfully",
      deletedClass: deletedClass,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting class", error: error.message });
  }
}

//soft restoring student
export async function softRestoreStudent(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // Soft restore the student
    const student = await Student.findByIdAndUpdate(
      id,
      { deleted: false }, // Set the deleted flag to false
      { new: true } // Return the updated document
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student soft restored successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error soft restoring student",
      error: error.message,
    });
  }
}

//soft restoring teachers
export async function softRestoreTeacher(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    // Soft restoring the student
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { deleted: false }, // Set the deleted flag to false
      { new: true } // Return the updated document
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher soft restored successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error soft restoring teacher",
      error: error.message,
    });
  }
}

//Mark attendance for students
export async function markAttendance(req, res) {
  const { studentId, classId, date, status, remarks } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID format" });
    }
    //checking if the attendace for this student and class already exist
    const existingAttendance = await Attendance.findOne({
      studentId,
      classId,
      date: { $eq: new Date(date).setHours(0, 0, 0, 0) }, // Check attendance for the specific date
    });
    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already recorded for today" });
    }
    // Creating a new attendance record
    const attendance = new Attendance({
      studentId,
      classId,
      date: new Date(date),
      status,
      remarks,
    });

    await attendance.save();
    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking attendance",
      error: error.message,
    });
  }
}

//get attendance for a student
export async function getAttendanceByStudent(req, res) {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // checking student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // query for attendance records
    const query = { studentId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query).populate("classId");

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({
      message: "Attendance records fetched successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
}

//get attendance for a class
export async function getAttendanceByClass(req, res) {
  const { classId } = req.params;
  const { date } = req.query;

  try {
    // checking class ID
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID format" });
    }

    const query = { classId };
    if (date) {
      query.date = { $eq: new Date(date).setHours(0, 0, 0, 0) }; // Ensuring matching date
    }

    const attendance = await Attendance.find(query).populate("studentId");

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({
      message: "Class attendance records fetched successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching class attendance records",
      error: error.message,
    });
  }
}

//Admin registration

export async function registerAdmin(req, res) {
  const { name, email, password } = req.body;
  try {
    //to check if user already exist
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    //create a new admin user

    const adminUser = new user({
      name,
      email,
      password,
    });

    await adminUser.save();
    res.status(201).json({
      message: "Admin registered successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering Admin", error: error.message });
  }
}

//Admin login

export async function loginAdmin(req, res) {
  const { email, password } = req.body;
  try {
    const admin = await user.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // password checking
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    //create JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}
