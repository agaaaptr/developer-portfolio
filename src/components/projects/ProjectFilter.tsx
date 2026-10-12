'use client';

import React from 'react';

export type ProjectCategory = 'all' | 'web' | 'mobile' | 'ai';

interface FilterOption {
  id: ProjectCategory;
  label: string;
  count: number;
}

interface ProjectFilterProps {
  options: FilterOption[];
  activeFilter: ProjectCategory;
  onFilterChange: (filter: ProjectCategory) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  options,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 sm:gap-3 md:mb-10">
      <span className="mr-1 font-mono text-xs uppercase tracking-wide text-ink/50">Filter by</span>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-all ${
            activeFilter === option.id
              ? 'bg-lime text-ink shadow-neo'
              : 'bg-card text-ink hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo'
          }`}
        >
          {option.label}
          <sup className="ml-1 text-[10px] opacity-60">{option.count.toString().padStart(2, '0')}</sup>
        </button>
      ))}
    </div>
  );
};
