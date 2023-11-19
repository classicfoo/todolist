
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

    document.getElementById('task-filter').addEventListener('input', filterTasks);

    updateTaskListDisplay();



});



function filterTasks() {
    const filterValue = document.getElementById('task-filter').value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(filterValue);
    });

    updateTaskListDisplay(filteredTasks);  // Update this to accept a tasks parameter
}

function updateTaskListDisplay(tasksToShow) {
    const taskListContainer = document.getElementById('task-list');
    if (taskListContainer) {
        taskListContainer.innerHTML = '';

        let tasks = tasksToShow || JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.setAttribute('data-task-id', task.id);

            // Determine the background color based on the task date
            const taskDate = new Date(task.date);
            if(taskDate.toDateString() === today.toDateString()) {
                taskElement.classList.add('bg-green');
            } else if(taskDate.toDateString() === tomorrow.toDateString()) {
                taskElement.classList.add('bg-blue');
            } else if(taskDate > tomorrow) {
                taskElement.classList.add('bg-light-blue');
            } else {
                taskElement.classList.add('bg-red');
            }

            taskElement.innerHTML = `<span class="task-date">${task.date}</span> <span class="task-title">${task.title}</span>`;
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



