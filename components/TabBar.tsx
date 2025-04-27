import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageCircle, UserCircle, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tabs = [
  { id: 'home', label: '首頁', path: '/', icon: Home },
  { id: 'chat', label: '聊天室', path: '/chat', icon: MessageCircle },
  { id: 'profile', label: '個人資料', path: '/profile', icon: UserCircle },
  { id: 'settings', label: '設定', path: '/settings', icon: Settings },
];

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(() => {
    const currentTab = tabs.find(tab => tab.path === pathname);
    return currentTab?.id || 'home';
  });

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4 bg-transparent">
      <div className="bg-[#FFEDE8]/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TooltipProvider key={tab.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleTabClick(tab.id, tab.path)}
                      className={`relative p-3 rounded-full text-sm font-medium transition-all duration-200
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
                      <span className="relative z-10 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tab.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar; 