let deletionInProgress = false;

document.addEventListener('DOMContentLoaded', function() {
  var taskId = localStorage.getItem('selectedTaskId');

    // Set the task date to today's date by default
    const dateInput = document.getElementById('task-date');
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10); // Formats the date to YYYY-MM-DD
    dateInput.value = formattedDate;


  if (taskId) {
      // Load task details from local storage or your data source
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const selectedTask = tasks.find(task => task.id === taskId);

      if (selectedTask) {
          // Set the task details in the form
          document.getElementById('task-title').value = selectedTask.title;
          document.getElementById('task-description').innerText = selectedTask.description;
          // Set the task date if it exists
          if (selectedTask.date) {
              dateInput.value = selectedTask.date;
          }
      }
  }


      // Function to handle input events
      function handleInputChange() {
        saveTask();
      }
    
      // Add input event listeners to the task title, description, and date fields
      document.getElementById('task-title').addEventListener('input', handleInputChange);
      document.getElementById('task-description').addEventListener('input', handleInputChange);
      document.getElementById('task-date').addEventListener('input', handleInputChange);

      //change background colour of date picker when it changes
      const datePicker = document.getElementById('task-date');
      if (datePicker.value) {
          setDateFieldColor(datePicker);
      }
  
      // When the date picker value changes
      datePicker.addEventListener('change', function() {
          setDateFieldColor(this);
      });

// Event listener for the delete button
document.getElementById('delete-task').addEventListener('click', function() {

      // Indicate that a deletion is in progress
      deletionInProgress = true;

  console.log('Delete button clicked'); // Confirm the event listener is triggered

  const selectedTaskId = localStorage.getItem('selectedTaskId');
  console.log('Selected Task ID:', selectedTaskId); // Check the retrieved ID

  if (selectedTaskId) {
      const confirmDelete = confirm('Are you sure you want to delete this task?');
      if (confirmDelete) {
          const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
          console.log('Tasks before deletion:', tasks); // Check tasks before deletion

          const taskIndex = tasks.findIndex(task => task.id === selectedTaskId);
          console.log('Task index to delete:', taskIndex); // Check the index found

          if (taskIndex !== -1) {
              tasks.splice(taskIndex, 1);
              localStorage.setItem('tasks', JSON.stringify(tasks));

              console.log('Tasks after deletion:', tasks); // Check tasks after deletion
              window.location.href = 'index.html';
          } else {
              console.error('Task not found in the array.');
          }
          localStorage.removeItem('selectedTaskId');
      }
  } else {
      console.error('No task selected for deletion.');
  }


      
});

// Additional code...


// Function to save task
function saveTask() {
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').innerText; // Use innerText for plain text
    const taskDate = document.getElementById('task-date').value; // Retrieve the value from the date input field
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Check if we are editing an existing task or creating a new one
    const selectedTaskId = localStorage.getItem('selectedTaskId');

    if (selectedTaskId) {
        // Update existing task
        const taskIndex = tasks.findIndex(task => task.id === selectedTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = taskTitle;
            tasks[taskIndex].description = taskDescription;
            tasks[taskIndex].date = taskDate; // Update the date
        } else {
            console.error('Task not found.');
            return; // Exit the function if the task is not found
        }
    } else {
        // Create new task
        const newTaskId = new Date().getTime().toString(); // Example ID generation
        const newTask = {
            id: newTaskId,
            title: taskTitle,
            description: taskDescription,
            date: taskDate // Include the date
        };
        tasks.push(newTask);

        // Update the selectedTaskId in localStorage
        localStorage.setItem('selectedTaskId', newTaskId);
    }

    // Save back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}




});


function setDateFieldColor(datePickerElement) {
    const selectedDate = new Date(datePickerElement.value);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if(selectedDate.toDateString() === today.toDateString()) {
        datePickerElement.style.backgroundColor = 'rgb(153, 216, 195)'; // green
    } else if(selectedDate.toDateString() === tomorrow.toDateString()) {
        datePickerElement.style.backgroundColor = 'rgb(153, 203, 254)'; // blue
    } else if(selectedDate > tomorrow) {
        datePickerElement.style.backgroundColor = 'rgb(222, 240, 250)'; // light blue
    } else {
        datePickerElement.style.backgroundColor = 'rgb(231, 154, 174)'; // red
    }
}
