function updateLiveTime() {
    // Create a new Date object
    var currentDate = new Date();
  
    // Get the time component
    var date = currentDate.toDateString();
    var time = currentDate.toLocaleTimeString();
  
    // Display the current Date & time
    document.getElementById("liveTime").innerHTML = "Date: " + date + "<br>Time: " + time;
  }
  
  // Update the time every second (1000 milliseconds)
  setInterval(updateLiveTime, 1000);
  
  // Initial call to set the initial time
  updateLiveTime();



function addExpense() {
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const expenseCategory = document.getElementById("expenseCategory").value;
    const amount = document.getElementById("amount").value;

    if (!date || !category || !expenseCategory || !amount) {
        alert("Please fill in all fields.");
        return;
    }

    const expenseList = document.getElementById("expenseList");
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${date}</span>
        <span>${category}</span>
        <span>${expenseCategory}</span>
        <span>${amount}</span>
        <button onclick="removeExpense(this)">Close</button>
        <button onclick="openModal()">Add Note</button>
    `;
    // Append the list item to the expense list
    document.getElementById("expenseList").appendChild(li);
    //expenseList.appendChild(li);

    // Save the updated list to local storage
    saveExpensesToLocalStorage();

    // Clear input fields after adding an expense
    document.getElementById("date").value = "";
    document.getElementById("category").value = "";
    document.getElementById("expenseCategory").value = "";
    document.getElementById("amount").value = "";
}

function removeExpense(button) {
    const li = button.parentElement;
    li.remove();
   
}

// Function to clear only the "expenses" item from local storage
function clearLocalStorage() {
    localStorage.removeItem("expenses");
    expenses = []; // Reset expenses array
    //loadExpensesFromLocalStorage(); // Clear the displayed list
    location.reload();
  }


 // Function to save expenses to local storage
 function saveExpensesToLocalStorage() {
    const expenseList = Array.from(document.getElementById("expenseList").querySelectorAll("li")).map(li => li.innerHTML);
    localStorage.setItem("expenses", JSON.stringify(expenseList));
}

// Function to load expenses from local storage
function loadExpensesFromLocalStorage() {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
        const expenses = JSON.parse(savedExpenses);
        expenses.forEach(expense => {
            const li = document.createElement("li");
            li.innerHTML = expense;
            document.getElementById("expenseList").appendChild(li);
        });
    }
}

// Function to download the list
function downloadList() {
    const listElement = document.getElementById('expenseList');
    const listHTML = listElement.innerHTML;

    const blob = new Blob([listHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'list.txt';
    link.click();

    URL.revokeObjectURL(url);
  }

window.onload = function() {
    loadExpensesFromLocalStorage();
};

let notes = [];
let currentNoteIndex = -1;

function openModal() {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-text").value = "";

    // If editing a note, populate the modal with the current note text
    if (currentNoteIndex !== -1) {
        document.getElementById("modal-text").value = notes[currentNoteIndex];
    }
}

function saveNote() {
    const noteText = document.getElementById("modal-text").value;

    if (noteText.trim() === "") {
        alert("Note cannot be empty");
        return;
    }

    if (currentNoteIndex !== -1) {
        // Editing an existing note
        notes[currentNoteIndex] = noteText;
    } else {
        // Adding a new note
        notes.push(noteText);
    }

    updateNoteList();
    closeModal();
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    currentNoteIndex = -1;
}

function deleteNote(index) {
    notes.splice(index, 1);
    updateNoteList();
}

function editNote(index) {
    currentNoteIndex = index;
    openModal();
}

function viewNote(index) {
    const note = notes[index];
    const truncatedText = note.length > 50 ? note.substring(0, 50) + "..." : note;
    alert("Note Text:\n" + note);
}

function updateNoteList() {
    const noteList = document.getElementById("note-list");
    noteList.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="truncate">${notes[i]}</span>
            <button onclick="viewNote(${i})">View</button>
            <button onclick="editNote(${i})">Edit</button>
            <button onclick="deleteNote(${i})">Delete</button>
        `;
        noteList.appendChild(li);
    }
}

 