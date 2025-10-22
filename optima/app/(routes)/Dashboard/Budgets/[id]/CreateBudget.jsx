"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { Plus, Wallet, Menu, Trash2, Edit, X } from 'lucide-react';

function CreateBudget({ isSidebarOpen, setIsSidebarOpen }) {
  const [emojiIcon, setEmojiIcon] = useState('😄');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false); 
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // State for storing the list of budgets
  const [budgets, setBudgets] = useState([]);
  
  // Edit budget states
  const [editBudget, setEditBudget] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editEmojiPicker, setEditEmojiPicker] = useState(false);

  // Function to fetch all budgets from the backend
  const fetchBudgets = async () => {
  try {
    const response = await axios.get('https://du-hacks-finance-3.onrender.com/api/budgets');
    setBudgets(response.data); // Set the fetched budgets to the state
  } catch (error) {
    console.error('Error fetching budgets:', error);
  }
};


  // Fetch budgets on page load
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Function to handle budget creation
  const onCreateBudget = async () => {
    try {
      // Send new budget to the backend
      await axios.post('https://du-hacks-finance-3.onrender.com/api/budgets', {
        name,
        amount,
        emoji: emojiIcon,
      });
      toast.success('Budget Created Successfully');
      
      // Reset form
      setName('');
      setAmount('');
      setEmojiIcon('😄');

      // Fetch updated budgets after creating the new one
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
    }
  };

  // Function to handle budget edit
  const handleEditBudget = (budget) => {
    setEditBudget(budget._id);
    setName(budget.name);
    setAmount(budget.amount);
    setEmojiIcon(budget.emoji);
    setShowEditDialog(true);
  };

  // Function to update budget
  const onUpdateBudget = async () => {
    try {
      await axios.put(`https://du-hacks-finance-3.onrender.com/api/budgets/${editBudget}`, {
        name,
        amount,
        emoji: emojiIcon,
      });
      toast.success('Budget Updated Successfully');
      
      // Reset form
      setName('');
      setAmount('');
      setEmojiIcon('😄');
      setEditBudget(null);
      setShowEditDialog(false);

      // Fetch updated budgets
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Wallet size={24} className="text-white" strokeWidth={2.5} />
                </div>
                Budget Manager
              </h1>
              <p className="mt-1 text-gray-600 text-sm md:text-base font-medium">
                Create and manage your budgets
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Mobile Greeting */}
        <div className="sm:hidden mb-6 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50">
          <h2 className="text-2xl font-heading font-black text-gray-900 mb-1">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">Manage your budgets and financial goals</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <div className="hidden sm:flex bg-white/70 backdrop-blur-xl p-12 rounded-3xl items-center flex-col border-2 border-dashed 
                            border-indigo-300 cursor-pointer hover:shadow-2xl hover:border-indigo-500 hover:scale-[1.02]
                            transition-all duration-500 group shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center 
                              mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Plus size={32} className="text-white" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Create New Budget
              </h2>
              <p className="text-gray-600 mt-2">Click to add a new budget category</p>
            </div>
          </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className="absolute z-10">
                  <EmojiPicker 
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input placeholder="eg. Marketing" 
                         onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input 
                    type="number" 
                    placeholder="eg. Amount" 
                    onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button 
                disabled={!(name && amount)}
                onClick={onCreateBudget}
                className="mt-5 w-full"
                variant="outline">
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Display the list of budgets */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
              Your Budgets
            </h2>
            <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              {budgets.length} {budgets.length === 1 ? 'Budget' : 'Budgets'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.length > 0 ? (
              budgets.map((budget, index) => (
                <div 
                  key={budget._id} 
                  className="group bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50
                             hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 
                                  bg-gradient-to-br from-indigo-400 to-purple-400" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 
                                      flex items-center justify-center text-3xl group-hover:scale-110 
                                      group-hover:rotate-6 transition-all duration-300 shadow-md">
                        {budget.emoji}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEditBudget(budget)}
                          className="p-2.5 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 
                                     transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                          title="Edit Budget"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await axios.delete(`https://du-hacks-finance-3.onrender.com/api/budgets/${budget._id}`);
                              toast.success('Budget deleted successfully');
                              fetchBudgets();
                            } catch (error) {
                              console.error('Error deleting budget:', error);
                              toast.error('Failed to delete budget');
                            }
                          }}
                          className="p-2.5 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 
                                     transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                          title="Delete Budget"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {budget.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-indigo-600">
                        ${budget.amount}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">USD</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget Limit</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
                                flex items-center justify-center">
                  <Wallet size={40} className="text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">No budgets yet</p>
                <p className="text-gray-600 mb-6">Create your first budget to start tracking your finances</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="sm:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 
                         text-white rounded-full shadow-2xl hover:shadow-3xl
                         flex items-center justify-center z-50
                         transition-all duration-300 hover:scale-110 active:scale-95
                         border-2 border-white/20"
              aria-label="Create budget"
            >
              <Plus size={28} strokeWidth={2.5} className="transition-transform duration-300" />
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
                Create New Budget
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Set up a new budget category to track your spending.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Icon</label>
                <Button 
                  variant="outline" 
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  className="text-3xl h-16 w-16"
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-10 mt-2">
                  <EmojiPicker 
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name</label>
                <Input 
                  placeholder="e.g., Marketing" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
                <Input 
                  type="number" 
                  placeholder="e.g., 5000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="secondary">
                  <X size={18} /> Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  disabled={!(name && amount)}
                  onClick={onCreateBudget}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                >
                  <Plus size={18} /> Create Budget
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Budget Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
                Edit Budget
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update your budget details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Icon</label>
                <Button 
                  variant="outline" 
                  onClick={() => setEditEmojiPicker(!editEmojiPicker)}
                  className="text-3xl h-16 w-16"
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-10 mt-2">
                  <EmojiPicker 
                    open={editEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setEditEmojiPicker(false);
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name</label>
                <Input 
                  placeholder="e.g., Marketing" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
                <Input 
                  type="number" 
                  placeholder="e.g., 5000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditDialog(false);
                  setEditBudget(null);
                  setName('');
                  setAmount('');
                  setEmojiIcon('😄');
                }}
                className="flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </Button>
              <Button 
                disabled={!(name && amount)}
                onClick={onUpdateBudget}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
              >
                <Edit size={18} /> Update Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateBudget;