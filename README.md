# information-system


PROJECT: SCHOOL INFORMATION SYSTEM
School Information System 🏫📚




Overview
The School Information System is a web application that allows users to manage student  efficiently. It fetches data from an API, enabling searching, viewing, adding, updating, and deleting records in a simple and user-friendly interface.

Features
✅ Fetch and display all students.
✅ Search functionality for students by ID and name.
✅ View student details dynamically
✅ Add, update, and delete student records
✅ Responsive and user-friendly interface



Tech Stack
Frontend: HTML, CSS, JavaScript

Backend API: Dummy JSON API (or any real API in production)

Tools: Visual Studio Code (VS Code), WSL





API Endpoints Used
GET /users => Fetch all students

GET /users/{id} => Fetch a single student

POST /users/add => Add a new student

PATCH /users/{id} => Update student details

DELETE /users/{id} => Remove a student


fetchStudents() retrieves all students from the API.

fetchStudent(id) gets a specific student’s details.

addStudent(studentData) sends a POST request to add a student.

updateStudent(id, studentData) updates an existing student using PATCH.

deleteStudentFromAPI(id) removes a student from the database.


Event Listeners in JavaScript:

saveBtn.addEventListener('click', handleSaveStudent); =>Triggers saving a new student or updating an existing one.

searchBtn.addEventListener('click', handleSearch); => Filters students based on the search input.

studentsTableBody.addEventListener('click', function(e) {...}) => Detects if an "Edit", "Delete", or "View" button was clicked and calls the appropriate function.

functionality of .filter()

When a user types a name, email, or ID, the system filters students dynamically.

Uses .filter() to check if the search term exists in student properties.

If no results are found, it displays "No students found".


Rendering/display/update

The displayStudentsTable() function loops through the student list and generates HTML table rows dynamically.

When a student is deleted, the UI updates automatically.

FORM HANDLING

Users must enter firstName, lastName, and email before submitting.

The system prevents saving empty fields.

If editing, the form updates an existing student instead of creating a new one.

Future Improvements
🚀 Add authentication for secure access
🚀 Implement real API for data persistence
🚀 Improve UI with better styling and responsiveness

Contributors

👩‍💻 Developed by Marylyne Otieno and help from friends.
[Marylyne Otieno](https://github.com/marylyne-otieno)



