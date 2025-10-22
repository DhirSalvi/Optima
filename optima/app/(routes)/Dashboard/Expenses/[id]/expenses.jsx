"use client";
import React, { useState, useEffect } from "react";
import {
  Utensils,
  Car,
  Home as HomeIcon,
  Gamepad,
  Zap,
  Heart,
  HelpCircle,
  Plus,
  Edit,
  X,
  Trash2,
  DollarSign,
  Menu,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Skeleton component for loading states with modern rounded corners
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

// Reusable Button component with modern variants and interactions
const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseClass =
    "px-5 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center justify-center gap-2"; // Added flex and justify-center for icon alignment
  
  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg focus-visible:ring-indigo-500"
      : variant === "secondary"
      ? "bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 hover:shadow-md focus-visible:ring-gray-400"
      : variant === "danger"
      ? "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg focus-visible:ring-red-500"
      : variant === "success"
      ? "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg focus-visible:ring-green-500"
      : ""; // Default empty string if no variant matches
  
  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Notification component for success/error messages with updated styling
const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 p-4 rounded-xl shadow-xl text-white 
      ${type === "success" ? "bg-green-500" : "bg-red-500"} 
      flex items-center justify-between min-w-[250px] z-50 animate-slide-in`}
  >
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
      <X size={18} />
    </button>
  </div>
);

// Category definitions with icons and updated color classes for Tailwind
const categoryIcons = {
  Food: { component: Utensils, color: "orange" },
  Transportation: { component: Car, color: "blue" },
  Housing: { component: HomeIcon, color: "purple" },
  Entertainment: { component: Gamepad, color: "pink" },
  Utilities: { component: Zap, color: "cyan" },
  Healthcare: { component: Heart, color: "green" },
  Uncategorized: { component: HelpCircle, color: "gray" },
};
const categories = Object.keys(categoryIcons);

// Main Expenses component
export default function Expenses({ isSidebarOpen, setIsSidebarOpen }) {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0] // Added default date for new expenses
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [notification, setNotification] = useState(null);

  // Fetch expenses on mount
  useEffect(() => {
    fetch("https://du-hacks-finance-3.onrender.com/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setNotification({
          message: "Failed to load expenses",
          type: "error",
        });
        setLoading(false);
      });
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Expense name is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      errors.amount = "Valid amount is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.date) errors.date = "Date is required"; // Validate date
    return errors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  // Add new expense
  const handleAddExpense = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        "https://du-hacks-finance-3.onrender.com/api/expenses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add expense");

      const newExpense = await response.json();
      setExpenses([newExpense, ...expenses]); // Add new expense to the top
      setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
      setShowAddDialog(false);
      setNotification({
        message: "Expense added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      setNotification({
        message: "Failed to add expense. Please try again.",
        type: "error",
      });
    }
  };

  // Set form data for editing
  const handleEdit = (expense) => {
    setEditExpense(expense._id);
    setFormData({
      name: expense.name,
      amount: expense.amount,
      category: expense.category || "", // Ensure category is set for dropdown
      date: new Date(expense.date).toISOString().split('T')[0] // Format date for input
    });
    setShowEditDialog(true); // Show dialog when editing
    setFormErrors({}); // Clear any previous errors
  };

  // Update expense
  const handleUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `https://du-hacks-finance-3.onrender.com/api/expenses/${editExpense}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update expense");

      const updatedExpense = await response.json();
      setExpenses(
        expenses.map((exp) =>
          exp._id === updatedExpense._id ? updatedExpense : exp
        )
      );
      setEditExpense(null);
      setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
      setShowEditDialog(false); // Hide dialog after update
      setNotification({
        message: "Expense updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      setNotification({
        message: "Failed to update expense. Please try again.",
        type: "error",
      });
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    // Custom modal for confirmation instead of window.confirm
    const confirmDelete = await new Promise(resolve => {
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50";
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                <p class="text-lg font-semibold mb-4">Are you sure you want to delete this expense?</p>
                <div class="flex justify-center gap-4">
                    <button id="confirmDeleteBtn" class="px-5 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg focus-visible:ring-red-500">Delete</button>
                    <button id="cancelDeleteBtn" class="px-5 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 hover:shadow-md focus-visible:ring-gray-400">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('confirmDeleteBtn').onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };
        document.getElementById('cancelDeleteBtn').onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };
    });

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://du-hacks-finance-3.onrender.com/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((exp) => exp._id !== id));
      setNotification({
        message: "Expense deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      setNotification({
        message: "Failed to delete expense. Please try again.",
        type: "error",
      });
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  // Filter expenses by category
  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((exp) => exp.category === filterCategory);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <DollarSign size={24} className="text-white" strokeWidth={2.5} />
                </div>
                Expense Tracker
              </h1>
              <p className="mt-1 text-gray-600 text-sm md:text-base font-medium">
                Effortlessly manage and track your spending
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Mobile Greeting */}
        <div className="sm:hidden mb-6 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50">
          <h2 className="text-2xl font-heading font-black text-gray-900 mb-1">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>

        {/* Controls: Add Expense Button and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button
            variant="primary"
            onClick={() => {
              setShowAddDialog(true);
              setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
              setFormErrors({});
            }}
            className="hidden sm:flex w-full sm:w-auto shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add New Expense
          </Button>
          <div className="flex items-center gap-3 w-full sm:w-auto bg-white/70 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-md border border-gray-100/50">
            <label htmlFor="categoryFilter" className="text-gray-700 font-semibold text-sm whitespace-nowrap">
              Filter:
            </label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border-0 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         text-gray-700 bg-white font-medium cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Expense Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
                Add New Expense
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new expense to track your spending.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
              <div>
                <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
                <input
                  type="text"
                  id="expenseName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Groceries"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  id="expenseAmount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 50.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="expenseCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="expenseCategory"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="expenseDate"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.date}
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAddDialog(false);
                  setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
                  setFormErrors({});
                }}
              >
                <X size={18} /> Cancel
              </Button>
              <Button variant="primary" onClick={handleAddExpense}>
                <Plus size={18} /> Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Expense Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
                Edit Expense
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the details of your expense below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
              <div>
                <label htmlFor="editExpenseName" className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Name
                </label>
                <input
                  type="text"
                  id="editExpenseName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Groceries"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="editExpenseAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="editExpenseAmount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 50.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="editExpenseCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="editExpenseCategory"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="editExpenseDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="editExpenseDate"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="secondary" onClick={() => {
                setShowEditDialog(false);
                setEditExpense(null);
                setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
                setFormErrors({});
              }}>
                <X size={18} /> Cancel
              </Button>
              <Button variant="success" onClick={handleUpdate}>
                <Edit size={18} /> Update Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Total Expenses Summary */}
        <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50 mb-8 
                        hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Expenses</p>
              <h3 className="text-4xl font-black text-red-600">
                ${totalExpenses.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} tracked
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-red-100 text-red-600 mt-4 sm:mt-0 shadow-md">
              <DollarSign size={40} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loaders for expense cards
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-md h-32" // Fixed height for skeleton
              >
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : filteredExpenses.length === 0 ? (
            // Empty state message
            <div className="col-span-full text-center py-16 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
                              flex items-center justify-center">
                <HelpCircle size={40} className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">No expenses found</p>
              <p className="text-gray-600 mb-6">
                {filterCategory === "All" 
                  ? "Start tracking your expenses by adding your first one" 
                  : `No expenses in the ${filterCategory} category`}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddDialog(true)}
                className="mx-auto"
              >
                <Plus size={18} /> Add Your First Expense
              </Button>
            </div>
          ) : (
            // Render actual expense cards
            filteredExpenses.map((expense, index) => {
              const categoryData = expense.category && categoryIcons[expense.category]
                ? categoryIcons[expense.category]
                : { component: HelpCircle, color: "gray" };
              const IconComponent = categoryData.component;
              const colorClass = `bg-${categoryData.color}-100 text-${categoryData.color}-600`; // Dynamically generate color classes

              return (
                <div
                  key={expense._id}
                  className="group bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50
                             hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer 
                             flex flex-col justify-between overflow-hidden relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 
                                  bg-gradient-to-br from-red-400 to-pink-400" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} 
                                      group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                        <IconComponent size={26} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2.5 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 
                                     transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                          onClick={(e) => { e.stopPropagation(); handleEdit(expense); }}
                          title="Edit Expense"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2.5 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 
                                     transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                          onClick={(e) => { e.stopPropagation(); handleDelete(expense._id); }}
                          title="Delete Expense"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 truncate mb-2 group-hover:text-red-600 transition-colors">
                        {expense.name}
                      </p>
                      <p className="text-2xl font-black text-red-600 mb-3">
                        -${expense.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                          {expense.category || "Uncategorized"}
                        </span>
                        <span className="text-gray-500 font-medium">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => {
            setShowAddDialog(true);
            setFormData({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
            setFormErrors({});
          }}
          className="sm:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 
                     text-white rounded-full shadow-2xl hover:shadow-3xl
                     flex items-center justify-center z-50
                     transition-all duration-300 hover:scale-110 active:scale-95
                     border-2 border-white/20"
          aria-label="Add expense"
        >
          <Plus size={28} strokeWidth={2.5} className="transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
