import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import DataInput from '@/pages/DataInput';
import LuckyDraw from '@/pages/LuckyDraw';
import Grouping from '@/pages/Grouping';
import { Users, Gift, Database, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'data' | 'draw' | 'group';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('data');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'data', label: 'Data Input', icon: Database, component: DataInput },
    { id: 'draw', label: 'Lucky Draw', icon: Gift, component: LuckyDraw },
    { id: 'group', label: 'Grouping', icon: Users, component: Grouping },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="font-bold text-xl text-indigo-600 flex items-center gap-2">
          <Users className="w-6 h-6" />
          HR Toolkit
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 z-10 bg-white p-4 space-y-2 border-b border-gray-200 shadow-lg"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <div className="font-bold text-2xl text-indigo-600 flex items-center gap-2">
            <Users className="w-8 h-8" />
            HR Toolkit
          </div>
          <p className="text-xs text-gray-400 mt-1">Draw & Group Utility</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          v1.0.0
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'data' && 'Manage your list of participants.'}
              {activeTab === 'draw' && 'Randomly select winners from the list.'}
              {activeTab === 'group' && 'Automatically organize people into teams.'}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'data' && <DataInput />}
              {activeTab === 'draw' && <LuckyDraw />}
              {activeTab === 'group' && <Grouping />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
