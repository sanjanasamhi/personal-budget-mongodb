const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const Budget = require('./models/Budget'); // Import the Mongoose model
const app = express();
const port = 3002;

app.use('/', express.static('public'));
app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/budgetDB')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Endpoint to fetch budget data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find(); // Fetch data from MongoDB
        res.json(budgetData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// Endpoint to add new budget data (for testing in Postman)
app.post('/budget', async (req, res) => {
    const { title, value, color } = req.body;

    if (!title || !value || !color) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBudget = new Budget({ title, value, color });
        await newBudget.save(); // Save the new entry to MongoDB
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Test endpoint
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
