"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Wallet, PieChart, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-lg 
                  hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-500 relative overflow-hidden cursor-pointer">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 
                    bg-gradient-to-br from-indigo-400 to-purple-400" />
    <div className="relative">
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl 
                      flex items-center justify-center mb-4 shadow-lg
                      group-hover:scale-110 group-hover:rotate-6 group-active:scale-100 group-active:rotate-0 
                      transition-all duration-300">
        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set and track budgets with intelligent categorization and real-time updates."
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Understand your spending patterns with beautiful, interactive charts."
    },
    {
      icon: TrendingUp,
      title: "Goal Tracking",
      description: "Set financial goals and track your progress with automated insights."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000" />
      </div>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl 
                            flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">✨</span>
            </div>
            <span className={`font-heading font-black text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Optima
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/70 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg">
            <span className="text-sm font-semibold text-indigo-600">✨ Smart Financial Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-gray-900 mb-6 leading-tight">
            Master Your Money with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Optima
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-12 font-medium">
            Take control of your finances with intelligent budgeting, expense tracking,
            and AI-powered insights. Your path to financial freedom starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-in">
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                           text-white text-lg px-8 py-6 rounded-2xl flex items-center gap-2 shadow-xl hover:shadow-2xl
                           transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 bg-white/70 backdrop-blur-xl text-gray-900 hover:bg-white 
                         text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                         hover:scale-105 active:scale-95"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-black text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features to help you achieve your financial goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/70 backdrop-blur-xl py-20 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl 
                            hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                50K+
              </div>
              <div className="text-gray-700 font-semibold">Active Users</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl 
                            hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                $2M+
              </div>
              <div className="text-gray-700 font-semibold">Budget Managed</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl 
                            hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-700 font-semibold">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}