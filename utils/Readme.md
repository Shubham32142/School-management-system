School Management System API
This API provides endpoints to manage students, teachers, and classes in a school management system. It supports CRUD operations, soft delete, restore, and assignment functionality.
Students Routes

Create Student
URL: /create/student
Method: POST
Description: Adds a new student.
Request Body (Form-Data):
name (string) - Required
email (string) - Required
classId (string) - Required
profileImageUrl (file) - Optional (upload a profile image)
Response: Returns the created student.

Get All Students
URL: /students
Method: GET
Description: Fetches all students with pagination and optional class filtering.
Query Parameters:
page (number) - Optional
pageSize (number) - Optional
classId (string) - Optional
Response: Returns paginated list of students.

Get Student by ID
URL: /student/:id
Method: GET
Description: Fetches a student by their ID.
Response: Returns the student details.

Update Student
URL: /students/:id
Method: PUT
Description: Updates a student's details.
Request Body (Form-Data):
name (string) - Optional
email (string) - Optional
classId (string) - Optional
profileImageUrl (file) - Optional
Response: Returns the updated student details.

Soft Delete Student
URL: /student/delete/:id
Method: DELETE
Description: Soft deletes a student by marking them as deleted.
Response: Returns the soft-deleted student details.

Restore Soft-Deleted Student
URL: /student/restore/:id
Method: PATCH
Description: Restores a soft-deleted student.
Response: Returns the restored student details.

Teachers Routes

Create Teacher
URL: /create/teacher
Method: POST
Description: Adds a new teacher.
Request Body (Form-Data):
name (string) - Required
email (string) - Required
subject (string) - Required
profileImageUrl (file) - Optional (upload a profile image)
Response: Returns the created teacher.

Get All Teachers
URL: /teachers
Method: GET
Description: Fetches all teachers with pagination.
Query Parameters:
page (number) - Optional
pageSize (number) - Optional
Response: Returns paginated list of teachers.

Get Teacher by ID
URL: /teacher/:id
Method: GET
Description: Fetches a teacher by their ID.
Response: Returns the teacher details.

Update Teacher
URL: /teachers/:id
Method: PUT
Description: Updates a teacher's details.
Request Body (Form-Data):
name (string) - Optional
email (string) - Optional
subject (string) - Optional
profileImageUrl (file) - Optional
Response: Returns the updated teacher details.

Soft Delete Teacher
URL: /teacher/delete/:id
Method: DELETE
Description: Soft deletes a teacher by marking them as deleted.
Response: Returns the soft-deleted teacher details.

Restore Soft-Deleted Teacher
URL: /teacher/restore/:id
Method: PATCH
Description: Restores a soft-deleted teacher.
Response: Returns the restored teacher details.

Classes Routes

Create Class
URL: /create/class
Method: POST
Description: Adds a new class.
Request Body:
name (string) - Required
teacherId (string) - Required
Response: Returns the created class.

Get All Classes
URL: /classes
Method: GET
Description: Fetches all classes with pagination.
Query Parameters:
page (number) - Optional
pageSize (number) - Optional
Response: Returns paginated list of classes.

Update Class
URL: /class/:id
Method: PUT
Description: Updates a class's details.
Request Body:
name (string) - Optional
teacherId (string) - Optional
Response: Returns the updated class details.

Delete Class
URL: /class/delete/:id
Method: DELETE
Description: Permanently deletes a class.
Response: Returns the deleted class details.
Assignment Routes
Assign Teacher to Class
URL: /assign-teacher
Method: PUT
Description: Assigns a teacher to a class.
Request Body:
classId (string) - Required
teacherId (string) - Required
Response: Returns the updated class with the assigned teacher.

Assignment Routes
Assign Teacher to Class

URL: /assign-teacher
Method: PUT
Description: Assigns a teacher to a class.
Request Body:
classId (string) - Required
teacherId (string) - Required
Response: Returns the updated class with the assigned teacher.

Authentication Routes
Admin Registration

URL: /auth/register
Method: POST
Description: Registers a new admin.
Request Body:
name (string) - Required
email (string) - Required
password (string) - Required
Response: Returns a message confirming admin registration.

Admin Login
URL: /auth/login
Method: POST
Description: Logs in an existing admin and returns a JWT token.
Request Body:
email (string) - Required
password (string) - Required

After getting jwt token
In req.headers:-
Authorization = jwt <secret_token>
setup instructions :-

1. Install the dependencies
   -npm install
2. Start the server
   -npm start
