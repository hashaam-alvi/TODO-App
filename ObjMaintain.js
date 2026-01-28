let todoState = {
    tasks: []
};

let ul = document.querySelector("ol");
let input = document.querySelector(".taskName");
let taskForm = document.querySelector(".taskForm");
let addTaskBtn = document.getElementById("showForm");
let enterButton = document.querySelector(".enterB");


taskForm.style.display = "none";

addTaskBtn.addEventListener("click", () => {
    taskForm.style.display = "block";
    addTaskBtn.style.display = "none";
    input.focus();
});

enterButton.addEventListener("click", () => {
    addTask();
    hideForm();
});

let addTask = () => {
    const text = input.value.trim();
    if (!text) return;

    todoState.tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    input.value = "";
    renderTasks();
    showJSON();
}

function editTask(id) {
    let task = todoState.tasks.find(t => t.id === id);

    let li = [...ul.children].find(li =>
        li.querySelector(".left span")?.textContent === task.text
    );

    let span = li.querySelector(".left span");
    let currentText = task.text;

    let textarea = document.createElement("textarea");
    textarea.className = "editText";
    textarea.value = currentText;


    span.replaceWith(textarea);
    textarea.focus();

    const saveEdit = () => {
        const newText = textarea.value.trim();
        if (newText) {
            task.text = newText;
        }
        renderTasks();
        showJSON();
    };


    textarea.addEventListener("blur", saveEdit);
}


let renderTasks = () => {
    ul.innerHTML = "";

    todoState.tasks.forEach((task) => {
        let li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        let content = document.createElement("div");
        content.className = "content";

        let left = document.createElement("div");
        left.className = "left";

        let span = document.createElement("span");
        span.textContent = task.text;
        left.appendChild(span);

        let right = document.createElement("div");
        right.className = "right";

        let doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.className = "doneBtn";
        doneBtn.addEventListener("click", () => {
            toggleDone(task.id);
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delBtn";
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "editBtn";
        editBtn.addEventListener("click", () => {
            editTask(task.id);
        });

        right.appendChild(doneBtn);
        right.appendChild(deleteBtn);
        right.appendChild(editBtn);

        content.appendChild(left);
        content.appendChild(right);
        li.appendChild(content);
        ul.appendChild(li);
    });
}

let toggleDone = (id) => {
    let task = todoState.tasks.find((event) => event.id === id);

    if (task) {
        task.completed = !task.completed;
        renderTasks();
        showJSON();
    }
}


let deleteTask = (id) => {
    todoState.tasks = todoState.tasks.filter((event) => {
        return event.id !== id;
    });

    renderTasks();
    showJSON();
}


const hideForm = () => {
    taskForm.style.display = "none";
    addTaskBtn.style.display = "inline-block";
}


let getTodoTask = document.getElementById("getTodo");
getTodoTask.addEventListener("click", () => fetchTodos());

// let fetchTodos = () => {
//     fetch("https://jsonplaceholder.typicode.com/todos")
//         .then((response) => response.json())
//         .then((data) => {
//             todoState.tasks = data.slice(0, 5).map((todo) => ({
//                 id: todo.id,
//                 text: todo.title,
//                 completed: todo.completed
//             }));

//             renderTasks();
//             showJSON();
//         })
//         .catch((error) => {
//             console.error("Error fetching todos:", error);
//         });
// }

let fetchTodos = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((data) => {

            const existingIds = new Set(
                todoState.tasks.map((task) => task.id)
            );

            const newTodos = data
                .filter((todo) => !existingIds.has(todo.id))  // 
                .slice(0, 5)
                .map((todo) => ({
                    id: todo.id,
                    text: todo.title,
                    completed: todo.completed
                }));

            todoState.tasks.push(...newTodos);
            renderTasks();
            showJSON();
        })
        .catch((error) => {
            console.error("Error fetching todos:", error);
        });
}



const showJSON = () => document.getElementById("jsonView").innerText = JSON.stringify(todoState.tasks, null, 2);