document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const studentsTableBody = document.getElementById('students-table-body');
  const studentForm = document.getElementById('student-form');
  const formTitle = document.getElementById('form-title');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const detailsContent = document.getElementById('details-content');
//apr
  const API_URL = 'https://dummyjson.com/users';
//variable
  let students = []; //Holds fetched student data
  let isEditing = false; //editing
  let currentStudentId = null; //Stores the ID of the student being edited
//initialize
  init();

  async function init() {
    await fetchStudents();
    setupEventListeners();
  }
  //fetch all students

  async function fetchStudents() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      students = data.users || [];
      displayStudentsTable();
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to load students. Using fallback data.');
      students = getFallbackData();
      displayStudentsTable();
    }
  }
//fetching single student
  async function fetchStudent(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching student:', error);
      return students.find((s) => s.id === id) || null;
    }
  }
//adds a new student
  async function addStudent(studentData) {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const newStudent = await response.json();
      students.unshift(newStudent);
      displayStudentsTable();
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }
//update
  async function updateStudent(id, studentData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const updatedStudent = await response.json();
      const index = students.findIndex((s) => s.id === id);
      if (index !== -1) students[index] = updatedStudent;

      displayStudentsTable();
      return updatedStudent;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
//delete
  async function deleteStudent(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(id),
  });
      const result = await response.json();

      students = students.filter((student) => student.id !== id);
      displayStudentsTable();

      return result;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
//display on the table
  function displayStudentsTable(filteredStudents = null) {
    const studentsToRender = filteredStudents || students;
    studentsTableBody.innerHTML = '';

    if (studentsToRender.length === 0) {
      studentsTableBody.innerHTML = '<tr><td colspan="7">No students found</td></tr>';
      return;
    }

    studentsToRender.forEach((student) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.age || 'N/A'}</td>
        <td>${student.gender}</td>
        <td class="action-btns">
          <button class="edit-btn" data-id="${student.id}">Edit</button>
          <button class="delete-btn" data-id="${student.id}">Delete</button>
          <button class="view-btn" data-id="${student.id}">View</button>
        </td>
      `;
      studentsTableBody.appendChild(row);
    });
  }
// my events
//mouse click
  function setupEventListeners() {
  saveBtn.addEventListener('click', saveStudent);
    cancelBtn.addEventListener('click', resetForm);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (events) => {
      if (events.key === 'Enter') handleSearch();
    });

    studentsTableBody.addEventListener('click', (event) => {
      const studentId = parseInt(event.target.getAttribute('data-id'));
      if (event.target.classList.contains('edit-btn')) editStudent(studentId);
      else if (event.target.classList.contains('delete-btn')) handleDeleteStudent(studentId);
      else if (event.target.classList.contains('view-btn')) viewStudentDetails(studentId);
    });
  }
  //handling form
  async function saveStudent() {
    const studentData = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      age: parseInt(document.getElementById('age').value) || undefined,
      gender: document.getElementById('gender').value,
    };

    if (!studentData.firstName || !studentData.lastName || !studentData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      isEditing ? await updateStudent(currentStudentId, studentData) : await addStudent(studentData);
      resetForm();
    } catch (error) {
      alert('Operation failed. Please try again.');
    }
  }
  async function handleDeleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteStudent(id);
      if (currentStudentId === id) resetForm();
      detailsContent.innerHTML = '<p>Select a student to view details</p>';
    } catch (error) {
      alert('Failed to delete student.');
    }
  }
//editing
  function editStudent(studentId) {
    const student = students.find((student) => student.id === studentId);
    if (!student) return;

    isEditing = true;
    currentStudentId = studentId;
    formTitle.textContent = 'Edit Student';

    document.getElementById('student-id').value = student.id;
    document.getElementById('first-name').value = student.firstName;
    document.getElementById('last-name').value = student.lastName;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age || '';
    document.getElementById('gender').value = student.gender || 'male';

    studentForm.scrollIntoView({ behavior: 'smooth' });
  }
//view details
  async function viewStudentDetails(studentId) {
    try {
      const student = await fetchStudent(studentId);
      detailsContent.innerHTML = student
        ? `<h4>${student.firstName} ${student.lastName}</h4>
           <p><strong>ID:</strong> ${student.id}</p>
           <p><strong>Age:</strong> ${student.age}</p>
           <p><strong>Email:</strong> ${student.email}</p>`
        : '<p>Student not found</p>';
    } catch (error) {
      detailsContent.innerHTML = '<p>Failed to load details</p>';
    }
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    displayStudentsTable(students.filter((student) =>

  student.firstName.toLowerCase().includes(searchTerm)||
  student.lastName.toLowerCase().includes(searchTerm)||
student.email.toLowerCase().includes(searchTerm)));
  }

  function resetForm() {
    studentForm.reset();
    isEditing = false;
    formTitle.textContent = 'Add New Student';
  }

});

