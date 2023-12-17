
let deletionInProgress = false;

function convertDateToInputFormat(dateString) {
    // Split the date string by '/'
    const parts = dateString.split('/');

    // Extract day, month, and year from the split parts
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Create a Date object (Note: Month is 0-indexed, hence month - 1)
    const date = new Date(year, month - 1, day);

    // Format the date into YYYY-MM-DD
    const formattedYear = date.getFullYear();
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const formattedDay = String(date.getDate()).padStart(2, '0');

    // Return the formatted date string
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}


document.addEventListener('DOMContentLoaded', function() {
  var taskId = localStorage.getItem('selectedTaskId');

    const formatter = new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Australia/Sydney'
    });
        
    // Set the task date to today's date by default
    const dateInput = document.getElementById('task-date');
    const today = new Date();
    //const formattedDate = today.toISOString().substr(0, 10); // Formats the date to YYYY-MM-DD    
    var formattedDate = formatter.format(today);
    formattedDate = convertDateToInputFormat(formattedDate);
    dateInput.value = formattedDate;


  if (taskId) {
      // Load task details from local storage or your data source
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const selectedTask = tasks.find(task => task.id === taskId);

      if (selectedTask) {
          // Set the task details in the form
          document.getElementById('task-title').value = selectedTask.title;
          document.getElementById('task-description').value = selectedTask.description;
          // Set the task date if it exists
          if (selectedTask.date) {
              dateInput.value = selectedTask.date;
          }
      }
  }

  document.getElementById('complete-subtask').addEventListener('click', function() {
    let textarea = document.getElementById('task-description');
    let text = textarea.value;
    let lines = text.split('\n');
    let cursorPosition = textarea.selectionStart;
    let lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;
    let lineEnd = text.indexOf('\n', cursorPosition);
    lineEnd = lineEnd === -1 ? text.length : lineEnd;
    let line = text.substring(lineStart, lineEnd);

    if (line.startsWith('T ')) {
        let updatedLine = 'X ' + line.substring(2);
        let updatedText = text.substring(0, lineStart) + updatedLine + text.substring(lineEnd);
        textarea.value = updatedText;
        // Trigger confetti animation
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 },
          });    }
    saveTask();
});


document.getElementById('btnToday').addEventListener('click', function() {
        // Set the task date to today's date by default
        const dateInput = document.getElementById('task-date');
        const today = new Date();
        //const formattedDate = today.toISOString().substr(0, 10); // Formats the date to YYYY-MM-DD    
        var formattedDate = formatter.format(today);
        formattedDate = convertDateToInputFormat(formattedDate);
        document.getElementById('task-date').value = formattedDate;
        setDateFieldColor(datePicker);
        saveTask();
});

document.getElementById('btnTomorrow').addEventListener('click', function() {
    // Set the task date to tomorrow's date by default
    const dateInput = document.getElementById('task-date');
    const today = new Date();
    today.setDate(today.getDate() + 1);
    var formattedDate = formatter.format(today);
    formattedDate = convertDateToInputFormat(formattedDate);
    document.getElementById('task-date').value = formattedDate;
    setDateFieldColor(datePicker);
    saveTask();
});

document.getElementById('btnNextWeek').addEventListener('click', function() {
    // Set the task date to nextweek's date by default
    const dateInput = document.getElementById('task-date');
    const today = new Date();
    today.setDate(today.getDate() + 7);
    var formattedDate = formatter.format(today);
    formattedDate = convertDateToInputFormat(formattedDate);
    document.getElementById('task-date').value = formattedDate;
    setDateFieldColor(datePicker);
    saveTask();
});


      // Function to handle input events
      function handleInputChange() {
        saveTask();
      }
    
      // Add input event listeners to the task title, description, and date fields
      document.getElementById('task-title').addEventListener('input', handleInputChange);
      document.getElementById('task-description').addEventListener('input', handleInputChange);
      document.getElementById('task-description').addEventListener('keydown', checkForCompletedTaskLines);
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


document.getElementById('reset-tasks').addEventListener('click', replaceXWithT)

function replaceXWithT() {
    // Get the innerHTML of the contenteditable div
    let content = document.getElementById('task-description').value;

    // Replace all 'X' followed by a space with 'T' followed by a space
    content = content.replace(/x /gi, 'T ');

    // Update the contenteditable div with the modified content
    document.getElementById('task-description').value = content;
}

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

          completeTask(selectedTaskId);
      }
  } else {
      console.error('No task selected for deletion.');
  }


      
});

// Additional code...


// Function to save task
function saveTask() {
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').value; // Use innerText for plain text
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

function checkForCompletedTaskLines(event) {

    taskDescriptionElement = document.getElementById('task-description');
    const taskDescription = document.getElementById('task-description').value; // Use innerText for plain text

    if (event.key.toLowerCase() === 'x') {
        console.log("task completed");
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 },
          });
        
    }
}


function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
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



// In the task edit page
function completeTask(taskId) {
    localStorage.setItem('taskCompleted', 'true');
    window.location.href = 'index.html';
}


