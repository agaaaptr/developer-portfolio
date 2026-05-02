'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface AccordionItemData {
  id: string | number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string | number | null;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  items, 
  defaultOpenId = null 
}) => {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

  const toggleItem = (id: string | number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggleItem(item.id)}
          index={index}
        />
      ))}
    </div>
  );
};

interface AccordionItemProps {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  item, 
  isOpen, 
  onToggle,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="overflow-visible"
    >
      {/* Header with accent background - added padding wrapper for scale animation */}
      <div className="p-1 -m-1">
        <motion.button
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between text-left rounded-lg sm:rounded-xl transition-colors gap-1 sm:gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(126, 34, 206, 0.3) 50%, rgba(88, 28, 135, 0.4) 100%)',
          }}
          onClick={onToggle}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
              {item.title}
            </h3>
            {/* Plus/Minus icon - visible on mobile in the same row as title */}
            <motion.div
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-white sm:hidden"
            >
              {isOpen ? (
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            {/* Subtitle (date) */}
            {item.subtitle && (
              <span className="text-xs sm:text-sm text-gray-300 font-mono sm:mr-4">
                {item.subtitle}
              </span>
            )}
            
            {/* Plus/Minus icon - hidden on mobile, visible on desktop */}
            <motion.div
              className="hidden sm:flex w-6 h-6 items-center justify-center text-white"
            >
              {isOpen ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.div>
          </div>
        </motion.button>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              marginTop: 4,
              transition: {
                height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.25, delay: 0.05 },
                marginTop: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              marginTop: 0,
              transition: {
                height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.2 },
                marginTop: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
              }
            }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-dark-400/50 border border-gray-700/50 rounded-lg sm:rounded-xl">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
