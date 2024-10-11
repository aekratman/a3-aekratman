// Global variable to hold the logged-in username
window.loggedInUsername = '';

// Function to handle login
const login = async (event) => {
    event.preventDefault();

    const inputUsername = document.querySelector('#username').value;
    const inputPassword = document.querySelector('#password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername, password: inputPassword })
    });

    if (!response.ok) {
        console.error("Login failed:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log("User logged in:", data.username); // Check if username is received

    // Set the username globally
    window.loggedInUsername = data.username;
    console.log("Global loggedInUsername:", window.loggedInUsername);
};

// Function to submit data
const submit = async (event) => {
    event.preventDefault();

    const input = document.querySelector('#name');
    const input2 = document.querySelector('#musical');
    const input3 = document.querySelector('#songs');

    // Ensure "Unnamed" is used if the name field is empty
    const json = { 
        name: input.value.trim() !== "" ? input.value : "Unnamed",  
        musical: input2.value, 
        songs: input3.value
    };

    const body = JSON.stringify(json);
    console.log("Submitting data:", json);

    const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

    // Check if the response is OK before parsing
    if (!response.ok) {
        console.error("Error submitting data:", response.statusText);
        return;
    }

    // Get the JSON response and update the table
    const updatedList = await response.json();
    console.log(`User logged in as: ${updatedList.username}`);
    clearTable();
    generateTable(updatedList);
};

// Function to clear the existing table
function clearTable() {
    const currentTable = document.querySelector('table');
    if (currentTable) {
        currentTable.remove();
    }
}

// Function to delete a character from the list
async function deleteCharacter(name) {
    const characterName = name || "Unnamed Character"; // Use a default value if name is missing
    try {
        const response = await fetch('/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: characterName })
        });

        if (response.ok) {
            const updatedList = await response.json();
            if (Array.isArray(updatedList)) {
                updated(updatedList);
            } else {
                console.error("Error. Expected an array but got ", updatedList);
            }
        } else {
            console.error("Issue during deletion:", await response.text());
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to update a character's data
async function updateCharacter(oldName, updatedData) {
    try {
        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldName, updatedData })
        });

        if (!response.ok) {
            throw new Error(`Error updating data: ${response.statusText}`);
        }

        const updatedList = await response.json();
        console.log("Updated list:", updatedList);
        return updatedList; // Return the updated list to update the table
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

// Function to calculate role based on ranking
function calculateRole(ranking) {
    if (ranking > 0 && ranking < 2) {
        return "Ensemble";
    } else if (ranking >= 2 && ranking < 3) {
        return "Secondary Character";
    } else if (ranking >= 3) {
        return "Lead";
    } else {
        return "Invalid Input";
    }
}

// Function to generate the table
function generateTable(data) {
    let tbl = document.querySelector("#dataTable");

    if (!tbl) {
        tbl = document.createElement("table");
        tbl.id = "dataTable";
        tbl.style.borderCollapse = "collapse";
        tbl.style.border = "2px solid black";

        const tableHeader = document.createElement("thead");
        const hRow = document.createElement("tr");
        const headers = ["Name", "Musical", "Songs", "Role", "Actions"];

        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid black";
            th.style.padding = "5px";
            hRow.appendChild(th);
        });

        tableHeader.appendChild(hRow);
        tbl.appendChild(tableHeader);
        document.body.appendChild(tbl);
    }

    let tblBody = document.querySelector("#dataTable tbody");
    if (!tblBody) {
        tblBody = document.createElement("tbody");
        tbl.appendChild(tblBody);
    } else {
        tblBody.innerHTML = ""; // Clear existing rows
    }

    // Create rows
    data.forEach(item => {
        const row = document.createElement("tr");

        // Skip if it's sensitive data like passwords
        if (item.password) {
            return;  // Skip this entry if it's related to user credentials
        }

        // Check if the username matches the logged-in user
        if (item.username !== window.loggedInUsername) {
            console.log("Skipping item for user:", item.username);
            return;  // Skip this entry if the username does not match
        }

        // Fallback to "Unnamed" if name is missing or empty
        const itemName = item.name && item.name.trim() !== "" ? item.name : "Unnamed";

        // Create column for names
        const cellName = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.value = itemName;  // Use itemName which defaults to "Unnamed"
        nameInput.disabled = true; // Initially disabled
        cellName.appendChild(nameInput);
        cellName.style.border = "1px solid black";
        row.appendChild(cellName);

        // Create column for musical title
        const cellMusical = document.createElement("td");
        const musicalInput = document.createElement("input");
        musicalInput.value = item.musical;
        musicalInput.disabled = true; // Initially disabled
        cellMusical.appendChild(musicalInput);
        cellMusical.style.border = "1px solid black";
        row.appendChild(cellMusical);

        // Create column for songs
        const cellSongCount = document.createElement("td");
        const songsInput = document.createElement("input");
        songsInput.type = "number";
        songsInput.value = item.songs;
        songsInput.disabled = true; // Initially disabled
        cellSongCount.appendChild(songsInput);
        cellSongCount.style.border = "1px solid black";
        row.appendChild(cellSongCount);

        // Create column for role
        const cellRole = document.createElement("td");
        cellRole.textContent = calculateRole(item.songs);
        cellRole.style.border = "1px solid black";
        row.appendChild(cellRole);

        // Actions column
        const cellActions = document.createElement("td");

        const editButton = document.createElement("button"); 
        editButton.textContent = "Edit";

        // Edit button functionality
        editButton.onclick = function () {
            const isDisabled = nameInput.disabled;

            nameInput.disabled = !isDisabled;
            musicalInput.disabled = !isDisabled;
            songsInput.disabled = !isDisabled;

            if (isDisabled) {
                editButton.textContent = "Save"; 
            } else {
                editButton.textContent = "Edit";

                // Create an updated data object
                const updatedData = {
                    name: nameInput.value.trim() !== "" ? nameInput.value : "Unnamed", // Use "Unnamed" if empty
                    musical: musicalInput.value,
                    songs: songsInput.value
                };
                const newRole = calculateRole(songsInput.value);
                updatedData.role = newRole;

                // Update the role in the role column automatically after saving
                cellRole.textContent = newRole;
                console.log("New role: ", newRole);

                // Save changes and update the table
                updateCharacter(item.name, updatedData).then(updatedList => {
                    updated(updatedList); 
                }).catch(error => {
                    console.error("Error updating character:", error); 
                });
            }
        };

        cellActions.appendChild(editButton);

        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteCharacter(itemName); 
        };
        
        cellActions.appendChild(deleteButton);
        row.appendChild(cellActions);

        tblBody.appendChild(row);
    });
}

// Function to regenerate the table with updated data
function updated(data) {
    clearTable();  
    generateTable(data);  
}

// Set up event listeners on window load
window.onload = function() {
    const button = document.querySelector("#btnSubmit");
    button.onclick = submit;

    const loginForm = document.querySelector("#loginForm");
    loginForm.onsubmit = login;  // Assuming your login form has the ID "loginForm"
};

// Log the currently logged-in username
console.log("Logged in as:", window.loggedInUsername);
