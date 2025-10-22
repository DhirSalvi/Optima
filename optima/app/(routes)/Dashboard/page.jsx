  "use client";
  export const dynamic = "force-dynamic";
  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useUser } from "@clerk/nextjs";
  import { SignedIn, UserButton } from '@clerk/nextjs';
  import {
    PieChart as RechartsPieChart, 
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
  } from "recharts";
  import {
    Home,
    List,
    CreditCard,
    TrendingUp,
    Bell,
    Search,
    ArrowUp,
    ArrowDown,
    DollarSign,
    User,
    Utensils,
    Car,
    Home as HomeIcon,
    Gamepad,
    Zap,
    Heart,
    HelpCircle,
    Menu, 
    X, 
    PieChart, 
  } from "lucide-react";
  import Sidebar from "./_components/Sidebar";
  import axios from "axios";

  // Currency formatting utility for consistent display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Enhanced StatCard component with modern styling and hover effects
  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div
      className={`group relative bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50
                  hover:shadow-2xl hover:bg-white/90 transition-all duration-500 transform hover:-translate-y-2
                  overflow-hidden`}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 
                       bg-gradient-to-br ${color.replace("border-", "from-").replace("-500", "-400")} to-transparent`} />
      
      <div className="relative flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-1">
            {value}
          </h3>
          {trend && (
            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mt-2 ${
                trendValue >= 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trendValue >= 0 ? (
                <ArrowUp size={12} className="mr-1" />
              ) : (
                <ArrowDown size={12} className="mr-1" />
              )}
              {Math.abs(trendValue)}% vs last month
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${color
            .replace("border-", "bg-")
            .replace("-500", "-100")} ${color.replace("border-", "text-")} 
            group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md`}
        >
          <Icon size={28} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  // Skeleton component for loading states, with improved visual appeal
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
  );

  // Reusable Button component with modern variants and interactions
  const Button = ({ children, variant = "primary", className, ...props }) => {
    const baseClass =
      "px-5 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 " +
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    
    const variantClass =
      variant === "primary"
        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg focus-visible:ring-indigo-500"
        : "bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 hover:shadow-md focus-visible:ring-gray-400";
    
    return (
      <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  // Custom tooltip for charts with a more refined design
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-80">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: `}
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Category-specific icons for better visual representation
  const categoryIcons = {
    Food: Utensils,
    Transportation: Car,
    Housing: HomeIcon,
    Entertainment: Gamepad,
    Utilities: Zap,
    Healthcare: Heart,
    Uncategorized: HelpCircle,
  };

  // Main Dashboard component
  function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

    // Fetch data on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch budgets
          const budgetsResponse = await axios.get(
            "https://du-hacks-finance-3.onrender.com/api/budgets"
          );
          setBudgets(budgetsResponse.data);
          const budgetTotal = budgetsResponse.data.reduce(
            (acc, budget) => acc + budget.amount,
            0
          );
          setTotalBudget(budgetTotal);

          // Fetch expenses
          const expensesResponse = await axios.get(
            "https://du-hacks-finance-3.onrender.com/api/expenses"
          );
          setExpenses(expensesResponse.data);
          const expenseTotal = expensesResponse.data.reduce(
            (acc, expense) => acc + expense.amount,
            0
          );
          setTotalSpend(expenseTotal);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    // Calculate remaining budget and usage percentage
    const remainingBudget = totalBudget - totalSpend;
    const budgetUsagePercentage =
      totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

    // Data for the budget overview pie chart
    const pieData = [
      { name: "Remaining", value: remainingBudget, color: "#10b981" }, // Green
      { name: "Spent", value: totalSpend, color: "#ef4444" }, // Red
    ];

    // Aggregate expenses by category for the expense pie chart
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    // Define colors for expense categories
    const categoryColors = {
      Food: "#f59e0b", // Amber
      Transportation: "#3b82f6", // Blue
      Housing: "#8b5cf6", // Violet
      Entertainment: "#ec4899", // Pink
      Utilities: "#06b6d4", // Cyan
      Healthcare: "#10b981", // Green
      Uncategorized: "#6b7280", // Gray
    };

    // Data for the expense categories pie chart
    const expensePieData = Object.keys(expensesByCategory).map((category) => ({
      name: category,
      value: expensesByCategory[category],
      color: categoryColors[category] || "#6b7280",
    }));

    // Mock data for monthly financial trend chart
    const monthlyTrendData = [
      { month: "Jan", income: 5000, expenses: 3200, savings: 1800 },
      { month: "Feb", income: 5200, expenses: 3500, savings: 1700 },
      { month: "Mar", income: 5100, expenses: 3300, savings: 1800 },
      { month: "Apr", income: 5400, expenses: 3100, savings: 2300 },
      { month: "May", income: 5600, expenses: 3800, savings: 1800 },
      { month: "Jun", income: 5800, expenses: 3600, savings: 2200 },
    ];

    return (
      <div className="flex h-screen overflow-hidden font-sans relative">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000" />
        </div>
        
        {/* Sidebar component, conditionally rendered for mobile */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation Header */}
          <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm z-30 sticky top-0">
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                  {/* Hamburger menu icon for small screens */}
                  <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="md:hidden mr-4 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Open sidebar"
                  >
                      <Menu size={24} />
                  </button>
                  <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500 hidden sm:block">
                      {isLoaded ? `Welcome back, ${user?.firstName || 'User'}!` : "Welcome back..."}
                    </p>
                  </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search input for larger screens */}
                <div className="relative hidden sm:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 md:w-64 shadow-sm"
                  />
                </div>
                {/* Notification bell icon */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                {/* User button (Clerk) or skeleton loader */}
                {!isLoaded ? (
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-4 w-24 hidden sm:block" />
                  </div>
                ) : (
                  isSignedIn && (
                    <div className="flex items-center space-x-3">
                      <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                      </SignedIn>
                    </div>
                  )
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
            {loading ? (
              // Skeleton loading state for the entire dashboard
              <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                          <Skeleton className="h-4 w-2/3 mb-3" />
                          <Skeleton className="h-8 w-1/2 mb-2" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                          <Skeleton className="h-6 w-1/3 mb-4" />
                          <Skeleton className="h-64 w-full" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-white p-6 rounded-2xl shadow-lg"
                        >
                          <Skeleton className="h-6 w-1/3 mb-4" />
                          <Skeleton className="h-48 w-full" />
                        </div>
                      ))}
                    </div>
              </div>
            ) : (
              <>
                {/* Stats Overview Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Budget"
                    value={formatCurrency(totalBudget)}
                    icon={DollarSign}
                    trend={true}
                    trendValue={8}
                    color="border-indigo-500"
                  />
                  <StatCard
                    title="Total Expenses"
                    value={formatCurrency(totalSpend)}
                    icon={CreditCard}
                    trend={true}
                    trendValue={-3}
                    color="border-red-500"
                  />
                  <StatCard
                    title="Remaining Budget"
                    value={formatCurrency(remainingBudget)}
                    icon={TrendingUp}
                    trend={true}
                    trendValue={12}
                    color="border-green-500"
                  />
                  <StatCard
                    title="Budget Usage"
                    value={`${budgetUsagePercentage}%`}
                    icon={PieChart}
                    color="border-amber-500"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Budget Overview Chart */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50 
                                  hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3" />
                        Budget Overview
                      </h3>
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        Live
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="w-full md:w-1/2 h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              label={({ name, percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              }
                              // Add animation for a smoother appearance
                              isAnimationActive={true}
                              animationDuration={800}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0 md:ml-4 space-y-4">
                        {/* Progress bar for Remaining Budget */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm text-gray-600">
                                Remaining
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {formatCurrency(remainingBudget)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${100 - budgetUsagePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        {/* Progress bar for Spent Budget */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-sm text-gray-600">
                                Spent
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {formatCurrency(totalSpend)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${budgetUsagePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense Categories Chart */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50
                                  hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full mr-3" />
                        Expense Categories
                      </h3>
                      <div className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                        {expensePieData.length} Categories
                      </div>
                    </div>
                    {expensePieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <RechartsPieChart>
                          <Pie
                            data={expensePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` }
                            isAnimationActive={true}
                            animationDuration={800}
                          >
                            {expensePieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '14px' }} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[280px] text-gray-500 text-center">
                        <p>No expense data available to display categories.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50 mb-8
                                hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3" />
                      Monthly Financial Trend
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors">
                        6M
                      </button>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
                        1Y
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={monthlyTrendData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-sm" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
                      <Area type="monotone" dataKey="income" stroke="#8884d8" fill="url(#colorIncome)" strokeWidth={2} />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" strokeWidth={2} />
                      <Area type="monotone" dataKey="savings" stroke="#10b981" fill="url(#colorSavings)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Budgets Card */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-100/50
                                  hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3" />
                          Recent Budgets
                        </h3>
                        <Button variant="primary" className="text-sm px-4 py-2">View All</Button>
                      </div>
                      {budgets.length > 0 ? (
                        <div className="space-y-4">
                          {budgets.slice(0, 5).map((budget) => {
                            const IconComponent =
                              categoryIcons[budget.category] || HelpCircle;
                            return (
                              <div
                                key={budget._id}
                                className="group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 
                                           rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-200
                                           hover:shadow-md hover:scale-[1.02]"
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 
                                                text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}
                                  >
                                    <IconComponent size={22} />
                                  </div>
                                  <div className="ml-4">
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                      {budget.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {budget.category || "Uncategorized"}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                  {formatCurrency(budget.amount)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <List size={48} className="mb-3 text-gray-400" />
                          <p className="text-md mb-3">No budgets found</p>
                          <Button variant="primary">
                            Create Budget
                          </Button>
                        </div>
                      )}
                  </div>

                  {/* Recent Expenses Card */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-100/50
                                  hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full mr-3" />
                            Recent Expenses
                          </h3>
                          <Button variant="primary" className="text-sm px-4 py-2">View All</Button>
                      </div>
                      {expenses.length > 0 ? (
                          <div className="space-y-4">
                          {expenses.slice(0, 5).map((expense) => {
                              const IconComponent =
                              categoryIcons[expense.category] || HelpCircle;
                              return (
                              <div
                                  key={expense._id}
                                  className="group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 
                                             rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-red-200
                                             hover:shadow-md hover:scale-[1.02]"
                              >
                                  <div className="flex items-center">
                                  <div
                                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100 
                                                  text-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}
                                  >
                                      <IconComponent size={22} />
                                  </div>
                                  <div className="ml-4">
                                      <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                      {expense.name}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                      {expense.category || "Uncategorized"} • {new Date(expense.date).toLocaleDateString()}
                                      </p>
                                  </div>
                                  </div>
                                  <div className="text-right">
                                  <p className="text-base font-bold text-red-600 group-hover:text-red-700 transition-colors">
                                      -{formatCurrency(expense.amount)}
                                  </p>
                                  </div>
                              </div>
                              );
                          })}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <CreditCard size={48} className="mb-3 text-gray-400" />
                          <p className="text-md mb-3">No expenses found</p>
                          <Button variant="primary">
                              Add Expense
                          </Button>
                          </div>
                      )}
                  </div>
                </div>
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-white/60 backdrop-blur-xl border-t border-gray-200/50 py-4 px-6 mt-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
              <p className="text-sm text-gray-600 mb-2 sm:mb-0 font-medium">
                © 2025 Optima. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium">Privacy</a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium">Terms</a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  export default Dashboard;
