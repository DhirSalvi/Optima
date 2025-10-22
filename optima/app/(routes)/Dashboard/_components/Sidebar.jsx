"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { X, ChevronRight, Sparkles } from "lucide-react";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/Dashboard", icon: "📊" },
    { name: "Expenses", path: "/Dashboard/Expenses", icon: "💰" },
    { name: "Budgets", path: "/Dashboard/Budgets", icon: "📅" },
    { name: "Advisor", path: "/Dashboard/Advisory", icon: "📢" },
    { name: "Upgrade", path: "/Dashboard/upgrade-plan", icon: "📑" },
  ];

  // Improved logic to detect active paths, including dynamic routes
  const isActive = (path) => {
    if (path === "/Dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Dynamic classes for responsive behavior with enhanced styling and smooth animations
  const sidebarClasses = `
    w-72 
    bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600
    text-white flex flex-col shadow-2xl min-h-screen backdrop-blur-sm
    fixed top-0 left-0 h-full z-40 border-r border-white/10
    transform transition-all duration-500 ease-out
    md:relative md:translate-x-0
    ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-90"}
  `;

  return (
    <>
      {/* Overlay for mobile view with smooth fade animation */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden 
                     transition-all duration-500 ease-out"
          aria-hidden="true"
        />
      )}

      <div className={sidebarClasses}>
        {/* Header Section */}
        <div className="relative p-6 border-b border-white/10 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl 
                              flex items-center justify-center shadow-lg
                              hover:scale-110 hover:rotate-12 transition-all duration-300">
                <Sparkles size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-heading font-black text-white">
                  Optima
                </h1>
                <p className="text-xs text-white/70">Financial Dashboard</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 
                         transition-all duration-300 text-white/70 hover:text-white
                         hover:scale-110 active:scale-95"
              aria-label="Close sidebar"
            >
              <X size={20} className="hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1">
          <div className="mb-4">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-3">
              Navigation
            </p>
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    const targetPath = item.path === "/Dashboard/Expenses" || item.path === "/Dashboard/Budgets" 
                      ? `${item.path}/1` 
                      : item.path;
                    router.push(targetPath);
                  }}
                  className={`
                    w-full flex items-center justify-between 
                    p-3 rounded-xl text-left
                    transition-all duration-300 ease-out group relative overflow-hidden
                    hover:translate-x-1 active:scale-95
                    ${active 
                      ? 'bg-white/20 text-white shadow-lg border border-white/30 scale-105' 
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r" />
                  )}
                  
                  <div className="flex items-center space-x-3 flex-1">
                    <span 
                      className={`text-lg transition-all duration-300 ${
                        active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className={`font-medium transition-all duration-200 ${active ? 'font-semibold' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                  
                  <ChevronRight 
                    size={16} 
                    className={`transition-all duration-300 ${
                      active 
                        ? 'text-white translate-x-0 scale-110' 
                        : 'text-white/60 -translate-x-2 group-hover:translate-x-0 group-hover:text-white group-hover:scale-110'
                    }`}
                  />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                  -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20
                          hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-lg
                          cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full 
                              flex items-center justify-center
                              group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-sm">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Need Help?
                </p>
                <p className="text-xs text-white/70">
                  Check our guides
                </p>
              </div>
              <ChevronRight 
                size={14} 
                className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
