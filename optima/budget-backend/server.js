require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');

// Setup Express
const app = express();
const port = process.env.PORT || 5000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // To parse incoming JSON requests with size limit

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });


// =====================
// EXPENSES MODEL & ROUTES
// =====================
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
});
const Expense = mongoose.model('Expense', expenseSchema);

// Budget Schema
const budgetSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  emoji: String,
});

const Budget = mongoose.model('Budget', budgetSchema);


// POST endpoint to create a new budget
app.post('/api/budgets', [
  body('name').trim().notEmpty().withMessage('Budget name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('emoji').optional().trim().isLength({ max: 10 }).withMessage('Emoji too long'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, amount, emoji } = req.body;
    const newBudget = new Budget({ name, amount, emoji });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Error creating budget' });
  }
});

// GET endpoint to fetch total budget
app.get('/api/total-budget', async (req, res) => {
  try {
    const totalBudget = await Budget.aggregate([
      {
        $group: {
          _id: null, // Group all documents
          totalAmount: { $sum: "$amount" }, // Sum all amounts
        },
      },
    ]);

    // If there are no budgets, return 0
    res.status(200).json({ totalBudget: totalBudget.length > 0 ? totalBudget[0].totalAmount : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total budget', error });
  }
});

// GET endpoint to fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    console.log('Fetched Expenses:', expenses);  // Debugging log
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// POST endpoint to add a new expense
app.post('/api/expenses', [
  body('name').trim().notEmpty().withMessage('Expense name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 50 }).withMessage('Category too long'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, amount, category } = req.body;
    const newExpense = new Expense({ name, amount, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
});


// PUT endpoint to update an expense by ID
app.put('/api/expenses/:id', [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  body('name').trim().notEmpty().withMessage('Expense name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 50 }).withMessage('Category too long'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, category } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, amount, category },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense' });
  }
});


// DELETE endpoint to delete a budget by ID
app.delete('/api/budgets/:id', [
  param('id').isMongoId().withMessage('Invalid budget ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({ message: 'Budget deleted successfully', deletedBudget });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Error deleting budget' });
  }
});

// DELETE endpoint to delete an expense by ID
app.delete('/api/expenses/:id', [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully', deletedExpense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
});


// GET endpoint to fetch all budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const budgets = await Budget.find(); // Fetch all budgets
    res.status(200).json(budgets); // Return the list of budgets
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});