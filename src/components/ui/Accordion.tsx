'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

export const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId = null }) => {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

  const toggleItem = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
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

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={isOpen ? 'rounded-b-base shadow-neo' : ''}
    >
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 border-2 border-ink bg-card p-4 text-left transition-[translate,box-shadow] sm:p-5 ${
          isOpen
            ? 'rounded-t-base shadow-none'
            : 'rounded-base shadow-neo hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'
        }`}
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="font-display text-lg uppercase leading-none">{item.title}</h3>
          {item.subtitle && (
            <span className="mt-1 block font-mono text-xs uppercase tracking-wide text-ink/60">
              {item.subtitle}
            </span>
          )}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-base border-2 border-ink bg-lime">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="rounded-b-base border-2 border-t-0 border-ink bg-card p-5">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
