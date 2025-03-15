const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/quizdb-mongo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB for Submit Service'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model
const questionSchema = new mongoose.Schema({
    question: String,
    answers: [String],
    correctAnswer: String,
    category: String
});
const Question = mongoose.model('Question', questionSchema);

// Fetch all unique categories
app.get('/categories', async (req, res) =>
{
    try
    {
        const categories = await Question.distinct('category');
        res.json(categories);
    } catch (error)
    {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Submit a new question
app.post('/submit', async (req, res) =>
{
    const { question, answers, correctAnswer, category, newCategory } = req.body;

    if (!question || !answers || answers.length !== 4 || !correctAnswer || (!category && !newCategory))
    {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const chosenCategory = newCategory || category;

    try
    {
        const newQuestion = new Question({ question, answers, correctAnswer, category: chosenCategory });
        await newQuestion.save();
        res.json({ message: 'Question submitted successfully!' });
    } catch (error)
    {
        res.status(500).json({ error: 'Failed to submit question' });
    }
});

// Serve the submit.html file
app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

// Start the server
app.listen(PORT, () =>
{
    console.log(`Submit Service running at http://localhost:${PORT}`);
});
