const API_URL = "http://localhost:3000/students";


const form = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");

const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const age = document.getElementById("age");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const studentList =
    document.getElementById("studentList");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");



function showLoading(text) {

    loading.textContent = text;

}


function hideLoading() {

    loading.textContent = "";

}



function showMessage(text, type) {

    message.textContent = text;

    message.className = type;

    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 3000);

}



async function getStudents() {

    showLoading("Loading students...");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load student records."
            );

        }

        const students = await response.json();

        displayStudents(students);

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

    finally {

        hideLoading();

    }

}




function displayStudents(students) {

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML = `
            <p class="empty">
                No student records found.
            </p>
        `;

        return;

    }


    students.forEach(student => {

        const studentCard =
            document.createElement("div");

        studentCard.className =
            "student-card";


        studentCard.innerHTML = `

            <div>

                <h3>
                    ${student.firstName}
                    ${student.lastName}
                </h3>

                <p>
                    ID: ${student.id}
                </p>

                <p>
                    Email: ${student.email}
                </p>

                <p>
                    Age: ${student.age}
                </p>

            </div>


            <div>

                <button
                    onclick="editStudent('${student.id}')"
                    class="edit"
                >
                    Edit
                </button>


                <button
                    onclick="deleteStudent('${student.id}')"
                    class="delete"
                >
                    Delete
                </button>

            </div>

        `;


        studentList.appendChild(studentCard);

    });

}



async function addStudent(studentData) {

    showLoading("Adding student...");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify(studentData)

        });


        if (!response.ok) {

            throw new Error(
                "Failed to add student."
            );

        }


        const newStudent =
            await response.json();


        console.log(
            "Created student:",
            newStudent
        );


        showMessage(
            "Student added successfully!",
            "success"
        );


        form.reset();


        // Get updated records from API

        await getStudents();

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

    finally {

        hideLoading();

    }

}


async function getStudent(id) {

    showLoading(
        "Getting student information..."
    );

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Student not found."
            );

        }


        const student =
            await response.json();


        return student;

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

        return null;

    }

    finally {

        hideLoading();

    }

}


async function editStudent(id) {

    const student =
        await getStudent(id);


    if (!student) {

        return;

    }


    studentId.value =
        student.id;

    firstName.value =
        student.firstName;

    lastName.value =
        student.lastName;

    email.value =
        student.email;

    age.value =
        student.age;


    submitButton.textContent =
        "Update Student";


    cancelButton.style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



async function updateStudent(
    id,
    studentData
) {

    showLoading("Updating student...");

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update student."
            );

        }


        const updatedStudent =
            await response.json();


        console.log(
            "Updated student:",
            updatedStudent
        );


        showMessage(
            "Student updated successfully!",
            "success"
        );


        cancelEdit();


        // Reload records

        await getStudents();

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

    finally {

        hideLoading();

    }

}


async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;

    }


    showLoading("Deleting student...");

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE"

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete student."
            );

        }


        showMessage(
            "Student deleted successfully!",
            "success"
        );


        // Reload records

        await getStudents();

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

    finally {

        hideLoading();

    }

}



// Form submission event listener


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const studentData = {

            firstName:
                firstName.value.trim(),

            lastName:
                lastName.value.trim(),

            email:
                email.value.trim(),

            age:
                Number(age.value)

        };


        // UPDATE

        if (studentId.value) {

            await updateStudent(
                studentId.value,
                studentData
            );

        }


        // CREATE

        else {

            await addStudent(
                studentData
            );

        }

    }
);



// Cancels Edit


function cancelEdit() {

    form.reset();

    studentId.value = "";

    submitButton.textContent =
        "Add Student";

    cancelButton.style.display =
        "none";

}





getStudents();