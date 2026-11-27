'use client';

import React from 'react';
import type { TaskPriority, TaskStatus } from '@/types/devflow';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  assigneeName?: string | null;
  sprintName?: string | null;
  status: TaskStatus;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const NEXT_STATUS_MAP: Record<TaskStatus, TaskStatus> = {
  TO_DO: 'IN_PROGRESS',
  IN_PROGRESS: 'UNDER_REVIEW',
  UNDER_REVIEW: 'DONE',
  DONE: 'TO_DO',
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  High: 'bg-rose-100 text-rose-800 border-rose-200',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200',
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function TaskCard({
  id,
  title,
  description,
  priority,
  assigneeName,
  sprintName,
  status,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="mb-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[priority]}`}
        >
          {priority}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500">#{id.slice(-4)}</span>
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label={`Delete task ${title}`}
            className="cursor-pointer rounded px-1.5 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
          >
            Delete
          </button>
        </div>
      </div>

      <h4 className="mb-1 text-sm font-semibold text-slate-900">{title}</h4>

      {description ? (
        <p className="mb-3 line-clamp-2 text-xs text-slate-600">{description}</p>
      ) : (
        <div className="mb-3" />
      )}

      {sprintName ? (
        <div className="mb-3">
          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            Sprint: {sprintName}
          </span>
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-600">
        <span className="truncate font-medium">{assigneeName || 'Unassigned'}</span>
        <button
          type="button"
          onClick={() => onStatusChange(id, NEXT_STATUS_MAP[status])}
          className="cursor-pointer font-semibold text-blue-700 transition-colors hover:text-blue-900"
        >
          Move →
        </button>
      </div>
    </div>
  );
}