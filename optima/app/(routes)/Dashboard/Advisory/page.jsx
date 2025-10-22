"use client";

import { useState } from "react";
import Sidebar from "../_components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Menu, Lightbulb, TrendingUp, DollarSign } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AdvisoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatResponse = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const getAdvice = async () => {
    if (!userInput.trim()) {
      setError("⚠️ Please enter a financial query.");
      return;
    }

    setLoading(true);
    setAdvice("");
    setError("");

    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!GEMINI_API_KEY) {
        setError("❌ API key not configured. Please check your environment variables.");
        setLoading(false);
        return;
      }

      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Generate content
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        setAdvice(formatResponse(generatedText));
      } else {
        setError("⚠️ No advice available. Please try again.");
      }

    } catch (error) {
      console.error("Error fetching advice:", error);
      setError("❌ Failed to get advice. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
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
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Sparkles size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  AI Financial Advisor
                </h1>
                <p className="mt-1 text-gray-600 text-sm md:text-base font-medium">
                  Get personalized financial advice powered by AI
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Quick Tips Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Investment Tips</h3>
                <p className="text-sm text-gray-600">Get advice on growing your wealth</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4">
                  <DollarSign size={24} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Budget Planning</h3>
                <p className="text-sm text-gray-600">Optimize your spending habits</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4">
                  <Lightbulb size={24} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Smart Strategies</h3>
                <p className="text-sm text-gray-600">Learn financial best practices</p>
              </div>
            </div>

            {/* Main Advisory Card */}
            <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
                  Ask Your Question
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="E.g., How can I save more money each month?"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && getAdvice()}
                  className="flex-1 border-2 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                />
                <Button
                  onClick={getAdvice}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl 
                             hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Get Advice
                    </>
                  )}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Advice Display */}
              {advice && (
                <div className="mt-6 p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-lg animate-fadeInUp">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Lightbulb size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Expert Advice</h3>
                  </div>
                  <div
                    className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: advice }}
                  />
                </div>
              )}

              {/* Sample Questions */}
              {!advice && !loading && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-600 mb-3">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "How to create an emergency fund?",
                      "Best investment strategies for beginners",
                      "Tips to reduce monthly expenses",
                      "How to plan for retirement?"
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserInput(question)}
                        className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 
                                   rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
