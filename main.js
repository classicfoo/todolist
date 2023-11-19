
document.addEventListener('DOMContentLoaded', function() {
    // Select all task elements
    var tasks = document.querySelectorAll('.task');

    // Attach click event listeners to each task
    tasks.forEach(function(task) {
        task.addEventListener('click', function() {
            // Retrieve and store only the task ID
            var taskId = this.getAttribute('data-task-id');
            localStorage.setItem('selectedTaskId', taskId);
            
            // Redirect to the task-edit page
            window.location.href = 'task-edit.html';
        });
    });

    // Add event listener to the "Add Task" button
    document.getElementById('add-task').addEventListener('click', function() {
        // Clear the selected task ID when adding a new task
        localStorage.removeItem('selectedTaskId');
        // Redirect to the task-edit page
        window.location.href = 'task-edit.html';
    });

    updateTaskListDisplay();
});

// Function to update the task list display
function updateTaskListDisplay() {
    const taskListContainer = document.getElementById('task-list');
    if (taskListContainer) {
        taskListContainer.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Sort tasks by date in ascending order (oldest first)
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.setAttribute('data-task-id', task.id); // Set a unique ID for each task
            taskElement.innerHTML = `<span class="task-date">${task.date}</span> <span class="task-title">${task.title}</span>`;

            // Attach click event listener to the task element
            taskElement.addEventListener('click', function() {
                localStorage.setItem('selectedTaskId', task.id);
                window.location.href = 'task-edit.html';
            });

            taskListContainer.appendChild(taskElement);
        });
    } else {
        console.error("Task list container not found");
    }
}


