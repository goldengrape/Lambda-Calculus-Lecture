import React from 'react';

interface HistoryCardProps {
  name: string;
  role: string;
  description: string;
  quote?: string;
  imagePlaceholder?: string; // Using generic placeholder approach
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ name, role, description, quote }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xl font-serif font-bold text-slate-400 overflow-hidden">
           {/* Placeholder for portrait */}
           {name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          <span className="text-sm font-medium text-blue-600 mb-2 block">{role}</span>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{description}</p>
          
          {quote && (
            <blockquote className="border-l-2 border-slate-300 pl-4 italic text-slate-500 text-sm">
              "{quote}"
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};
