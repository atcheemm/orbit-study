'use client';

import { useState } from 'react';
import { Menu, Rocket, Zap, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { xp, streak } = useStore();

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#27231E]/95 backdrop-blur-sm border-b border-[#3A5253]/60 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center">
            <Rocket className="w-4 h-4 text-[#27231E]" />
          </div>
          <span className="font-bold text-[#FFF5F5]">
            {title || 'OrbitStudy'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span className="text-xs text-[#E07A5F] font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span className="text-xs text-[#E07A5F] font-bold">{xp}</span>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
