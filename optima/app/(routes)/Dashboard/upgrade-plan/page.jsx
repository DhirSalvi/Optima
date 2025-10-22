"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "../_components/Sidebar";
import { Check, Zap, Crown, Star, Menu, Sparkles } from "lucide-react";

export default function UpgradePlan() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Essential tracking", "Basic reports", "Community support"],
    },
    {
      name: "Pro",
      price: "$9.99/mo",
      features: ["Advanced analytics", "Priority support", "Custom categories"],
      highlight: true,
    },
    {
      name: "Premium",
      price: "$19.99/mo",
      features: ["All features unlocked", "24/7 Support", "AI-powered insights"],
    },
  ];

  const planIcons = {
    Basic: Star,
    Pro: Zap,
    Premium: Crown
  };

  const planColors = {
    Basic: "from-gray-500 to-gray-600",
    Pro: "from-indigo-500 to-purple-600",
    Premium: "from-yellow-500 to-orange-600"
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000" />
      </div>
      
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-20 px-4 md:px-8 py-4">
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
                    <Sparkles size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  Upgrade Your Plan
                </h1>
                <p className="mt-1 text-gray-600 text-sm md:text-base font-medium">
                  Choose the perfect plan for your financial journey
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Unlock Premium Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take control of your finances with advanced tools and insights. Choose a plan that fits your needs.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan, idx) => {
                const IconComponent = planIcons[plan.name];
                const gradientColor = planColors[plan.name];
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 flex flex-col 
                               border-2 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2
                               ${plan.highlight 
                                 ? "border-indigo-500 scale-105 md:scale-110" 
                                 : "border-gray-100/50"
                               }`}
                  >
                    {/* Popular Badge */}
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full 
                                      text-sm font-bold shadow-lg flex items-center gap-2">
                          <Star size={16} className="fill-current" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientColor} 
                                    flex items-center justify-center mb-6 shadow-lg`}>
                      <IconComponent size={32} className="text-white" strokeWidth={2.5} />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-3xl font-black text-gray-900 mb-2">{plan.name}</h3>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                      {plan.price !== "Free" && (
                        <span className="text-gray-600 text-lg ml-2">/month</span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={16} className="text-green-600" strokeWidth={3} />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 
                                 shadow-lg hover:shadow-xl transform hover:scale-105
                                 ${plan.highlight
                                   ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                   : "bg-gray-900 text-white hover:bg-gray-800"
                                 }`}
                      onClick={() => router.push("/Dashboard")}
                    >
                      {plan.name === "Basic" ? "Current Plan" : "Upgrade Now"}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Features Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100/50"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Upgrade?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 
                                  flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-600 text-sm">
                    Get deeper insights into your spending patterns and financial health
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 
                                  flex items-center justify-center mx-auto mb-4">
                    <Crown size={32} className="text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Priority Support</h4>
                  <p className="text-gray-600 text-sm">
                    Get help when you need it with our dedicated support team
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 
                                  flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">AI-Powered Insights</h4>
                  <p className="text-gray-600 text-sm">
                    Let AI help you make smarter financial decisions
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
