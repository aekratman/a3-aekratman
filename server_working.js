require('dotenv').config();

const express = require('express'),
      cookie = require('cookie-session'),
      hbs = require('express-handlebars').engine,
      { MongoClient, ObjectId } = require('mongodb');
const app = express();

// Use express.urlencoded to get data sent by default form actions or GET requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = 'mongodb+srv://aekratman:abbeysPassword@abbeyscluster.0bppf.mongodb.net/?retryWrites=true&w=majority&appName=AbbeysCluster/';
const client = new MongoClient(uri);

// Handlebars
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(cookie({
  name: 'session',
  keys: ['secretKey01', 'secretKey02']
}));

// Create variable collection
let collection = null;

async function run() {
  try {
    await client.connect();  
    
    // Set the collection
    collection = client.db("logFromAssignment").collection("logs");
    console.log("Collection is set: ", collection !== null);
    
    // Insert a test document to the collection
    // await collection.insertOne({ testField: "testValue" });
    console.log("Inserted a test document into 'logs' collection.");
    
    return collection;
  } catch (err) {
    console.error("Error during MongoDB connection or insertion:", err);
  }
}

run().then((collection) => {
  if (collection) {
    console.log("Collection ready!");
  } else {
    console.log("Collection is not all set.");
  }
});

// Route to add a document
app.post('/add', async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

// Route to delete a document
app.delete('/delete', async (req, res) => {
  console.log("Deleting object from MongoDB...");

  try {
    const nameToDelete = req.body.name;

    if (!nameToDelete) {
      return res.status(400).send("Missing name in request body");
    }

    // Delete the document from MongoDB
    const result = await collection.deleteOne({ name: nameToDelete });

    if (result.deletedCount === 1) {
      console.log("Successfully deleted the object");

      // Fetch the updated list of characters after deletion
      const updatedList = await collection.find().toArray();
      res.status(200).json(updatedList);  // Ensure this is an array
    } else {
      console.log("Object not found");
      res.status(404).json({ message: "Object not found" });
    }
  } catch (error) {
    console.error("Error deleting object:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update a document
app.put('/update', async (req, res) => {
  const { oldName, updatedData } = req.body;

  try {
    const result = await collection.updateOne(
      { name: oldName },
      { $set: updatedData }
    );

    if (result.modifiedCount === 1) {
      const updatedList = await collection.find().toArray(); // Fetch the updated list
      res.json(updatedList);
    } else {
      res.status(404).json({ message: "Character not found or no changes made." });
    }
  } catch (error) {
    console.error("Error updating character:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
app.post('/login', async (req, res) => {
  console.log(req.body);

  const username = req.body.username || "null";
  const password = req.body.password;
  console.log(username);
  console.log(`Attempting login for user: ${username}`);

  if (collection === null) {
    console.log("collection not set");
  }

  const user = await collection.findOne({ username: username });

  if (req.body.password === password) {
    req.session.login = true;
    req.session.username = username;
    console.log(`User logged in: ${username}`);
    res.redirect('login');

    if (!user) {
      await collection.insertOne({ username: username, password: password });
    }
  } else {
    // Cancel session login in case if it's true
    req.session.login = false;
    res.render('index', { msg: 'Login has failed; try again!', layout: false });
  }
});

app.use(express.static("./"));

// Submit route
app.post('/submit', async (req, res) => {
  const { name, musical, songs } = req.body; // Extract other fields
  const username = req.session.username; // Get username from session

  console.log("Received data:", req.body); // Log the incoming data

  try {
    // Insert the new document into the MongoDB collection
    const result = await collection.insertOne({ username, name, musical, songs });
    console.log("Insertion result:", result); // Log the result of the insertion

    // Check if the insertion was successful
    if (result.insertedId) {
      // Fetch all documents from the collection after insertion
      const allDocuments = await collection.find().toArray(); // Fetch all entries
      console.log("All documents fetched:", allDocuments); // Log all documents

      // Send back all documents in an array
      res.json(allDocuments);
    } else {
      res.status(500).json({ error: 'Insertion failed, no document was inserted.' });
    }
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get documents for the logged-in user
app.get("/docs", async (req, res) => {
  const username = req.session.username; // Get username from session

  if (!username) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  try {
    if (collection !== null) {
      // Fetch only the documents where `username` matches the logged-in user
      const userDocuments = await collection.find({ username }).toArray();

      if (userDocuments.length > 0) {
        console.log("Matching user documents:", userDocuments);
        res.json(userDocuments);  // Return documents related to the user
      } else {
        console.log("No documents found for user:", username);
        res.json([]);  // Return an empty array if no documents are found
      }
    } else {
      res.status(500).json({ error: "Collection not set" });
    }
  } catch (error) {
    console.error("Error fetching documents for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to fetch and display the user's documents
async function fetchUserDocuments() {
  try {
    const response = await fetch('/docs');
    
    if (response.ok) {
      const userDocuments = await response.json();
      if (Array.isArray(userDocuments)) {
        generateTable(userDocuments);  // Use your generateTable function
      } else {
        console.error("Expected an array but got:", userDocuments);
      }
    } else {
      console.error("Failed to fetch user documents:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching user documents:", error);
  }
}

// Route for the home page
app.get('/', (req, res) => {
  console.log("Rendering your response, apping your GET");
  res.render('index', { msg: '', layout: false });
});

// Middleware to redirect unauthenticated users to the login page
app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' https://cdn.jsdelivr.net;");
  if (req.session.login === true)
    next();
  else
    res.render('index', { msg: 'login failed, please try again', layout: false });
});

// Route for the login page
app.get('/login', (req, res) => {
  const username = req.session.username || ''; // Get username from session
  const msg = username ? `You've logged in! Welcome, ${username}` : '';
  res.render('login', { msg: msg, layout: false });
});

// Start the server
app.listen(process.env.PORT || 3000);

// Function to generate and display the user's documents in a table format
function generateTable(userDocuments) {
  const table = document.createElement('table');
  table.border = '1';

  const headerRow = table.insertRow();
  const headers = ['Name', 'Musical', 'Songs']; // Adjust these based on your fields
  headers.forEach(header => {
    const th = document.createElement('th');
    th.innerText = header;
    headerRow.appendChild(th);
  });

  userDocuments.forEach(doc => {
    const row = table.insertRow();
    const cells = [doc.name, doc.musical, doc.songs]; // Adjust these based on your fields
    cells.forEach(cellData => {
      const cell = row.insertCell();
      cell.innerText = cellData;
    });
  });

  // Assuming you have a div with ID 'user-documents' to append the table
  const container = document.getElementById('user-documents');
  container.innerHTML = ''; // Clear previous contents
  container.appendChild(table);
}
