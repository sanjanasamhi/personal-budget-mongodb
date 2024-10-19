const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();
const Budget = require('./models/Budget_schema'); // Import the Budget model
const port = 3002;

// Middleware to parse JSON data
app.use(express.json());

// Load budget-data.json on server startup
let staticBudgetData = [];
const jsonDataPath = path.join(__dirname, 'budget-data.json');
fs.readFile(jsonDataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading budget-data.json:', err);
    } else {
        staticBudgetData = JSON.parse(data).myBudget; // Parse the myBudget array from JSON
        console.log('Loaded static budget data from JSON file');
    }
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Default route to serve static files
app.use('/', express.static('public'));

// Endpoint to fetch all budget data (from MongoDB and JSON)
app.get('/budget', async (req, res) => {
    try {
        const dbBudgets = await Budget.find();  // Fetch all budget entries from MongoDB

        // Format the MongoDB data to match the format from the JSON file
        const formattedDbBudgets = dbBudgets.map(budget => ({
            title: budget.title,
            budget: budget.budget,
            color: budget.color
        }));

        // Combine the static JSON data with the MongoDB data
        const combinedBudgets = [...formattedDbBudgets, ...staticBudgetData];

        res.json(combinedBudgets);  // Send the combined data to the frontend
    } catch (err) {
        res.status(500).send('Error fetching budget data');
    }
});

// Endpoint to add new budget data to MongoDB
app.post('/budget', async (req, res) => {
    const { title, budget, color } = req.body;

    // Validate that the required fields are provided
    if (!title || !budget || !color) {
        return res.status(400).send('All fields (title, budget, color) are required');
    }

    // Create a new budget document
    const newBudget = new Budget({
        title,
        budget,
        color
    });

    try {
        const savedBudget = await newBudget.save();  // Save the new entry to MongoDB
        res.json(savedBudget);  // Respond with the newly created document
    } catch (err) {
        res.status(400).send(err.message);  // Handle validation errors
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
