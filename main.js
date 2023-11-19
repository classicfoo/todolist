
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

            const taskDate = new Date(task.date);
            let dateText;

            if(taskDate.toDateString() === today.toDateString()) {
                dateText = 'Today';
                taskElement.classList.add('bg-green');
            } else if(taskDate.toDateString() === tomorrow.toDateString()) {
                dateText = 'Tomorrow';
                taskElement.classList.add('bg-blue');
            } else if(taskDate > tomorrow) {
                dateText = 'Later';
                taskElement.classList.add('bg-light-blue');
            } else {
                dateText = 'Overdue';
                taskElement.classList.add('bg-red');
            }

            // Create a container for the date and title with flexbox layout
            const taskInfo = document.createElement('div');
            taskInfo.classList.add('task-info');

            taskInfo.innerHTML = `
                <span class="task-date">${dateText}</span>
                <span class="task-title">${task.title}</span>
            `;

            taskElement.appendChild(taskInfo);
            taskListContainer.appendChild(taskElement);
        });
    } else {
        console.error("Task list container not found");
    }
}




