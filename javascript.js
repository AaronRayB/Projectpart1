let tasks = [];
let archivedTasks = [];

// Function to render the tasks in the table
function renderTasks() {
    const taskTable = document.getElementById('taskTable');
    taskTable.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
                <button class="archive" onclick="archiveTask(${index})">Archive</button>
            </td>
        `;
        taskTable.appendChild(row);
    });
}

// Function to add a new task
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
        recurring: document.getElementById('recurring').checked,
        recurrenceFrequency: document.getElementById('recurrenceFrequency').value,
        category: document.getElementById('category').value,
    };

    tasks.push(newTask);
    renderTasks();
    this.reset();

    if (newTask.recurring) {
        createRecurringTasks(newTask);
    }
});

// Function to create recurring tasks
function createRecurringTasks(task) {
    const currentDate = new Date(task.dueDate);
    let recurrenceCount = 5;  // Number of recurring tasks to create

    for (let i = 1; i <= recurrenceCount; i++) {
        const newDueDate = new Date(currentDate);
        if (task.recurrenceFrequency === 'daily') {
            newDueDate.setDate(newDueDate.getDate() + i);
        } else if (task.recurrenceFrequency === 'weekly') {
            newDueDate.setDate(newDueDate.getDate() + (7 * i));
        }

        const recurringTask = { ...task, dueDate: newDueDate.toISOString().split('T')[0] };  // Date formatting
        tasks.push(recurringTask);
    }

    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const task = tasks[index];

    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    document.getElementById('status').value = task.status;

    // Optionally remove the task and update after editing (not deleting outright)
    tasks.splice(index, 1);
    renderTasks();
}

// Function to archive a task
function archiveTask(index) {
    const archivedTask = tasks.splice(index, 1)[0];
    archivedTasks.push(archivedTask);
    renderTasks();
    renderArchivedTasks();
}

// Function to render archived tasks
function renderArchivedTasks() {
    const archivedTable = document.getElementById('archivedTasks');
    archivedTable.innerHTML = '';

    archivedTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td>
                <button onclick="unarchiveTask(${index})">Unarchive</button>
            </td>
        `;
        archivedTable.appendChild(row);
    });
}

// Function to unarchive a task
function unarchiveTask(index) {
    const unarchivedTask = archivedTasks.splice(index, 1)[0];
    tasks.push(unarchivedTask);
    renderTasks();
    renderArchivedTasks();
}
