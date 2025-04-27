import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'chat', label: '聊天室' },
  { id: 'achievement', label: '成就' },
  { id: 'settings', label: '設定' },
];

const TabBar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    console.log(`目前選中的頁籤: ${tabId}`);
  };

  return (
    <div className="w-full flex justify-center py-4">
      <div className="bg-[#FFEDE8] rounded-full p-2 shadow-sm">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id ? 'text-white' : 'text-[#5C5C5C] hover:text-[#FFA07A]'}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#FFA07A] to-[#FF69B4] rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar; 