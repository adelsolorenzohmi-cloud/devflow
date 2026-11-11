'use client';
import React from 'react';

interface TaskCardProps {
  id: string;
  title: string;
  priority: string;
  assigneeName?: string;
  status: string;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function TaskCard({ id, title, priority, assigneeName, status, onStatusChange }: TaskCardProps) {
  const nextStatusMap: Record<string, string> = {
    TO_DO: 'IN_PROGRESS',
    IN_PROGRESS: 'UNDER_REVIEW',
    UNDER_REVIEW: 'DONE',
    DONE: 'TO_DO',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">{priority}</span>
        <span className="text-xs text-slate-400 font-mono">#{id.slice(-4)}</span>
      </div>
      <h4 className="text-slate-800 font-medium text-sm mb-3">{title}</h4>
      <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>{assigneeName || 'Unassigned'}</span>
        <button
          onClick={() => onStatusChange(id, nextStatusMap[status])}
          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
        >
          Move →
        </button>
      </div>
    </div>
  );
}
