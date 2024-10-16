const mongoose = require('mongoose');

// Define the Budget schema
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-F]{6}$/i // Enforce 6-digit hexadecimal color format
    }
});

// Create the Budget model
const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
