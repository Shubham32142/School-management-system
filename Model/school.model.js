import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
//Student Schema
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImageUrl: { type: String },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: false,
    },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);
export const Student = mongoose.model("Students", studentSchema);

//Teacher Schema
const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    profileImageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Teacher = mongoose.model("Teachers", teacherSchema);

//Class Schema
const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teachers",
      required: true,
    },
    studentCount: { type: Number, default: 0, min: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const Class = mongoose.model("Classes", classSchema);

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excluded"],
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //hash the password using bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const user = mongoose.model("User", userSchema);
