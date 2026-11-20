'use client';

import React, { useState } from 'react';
import type { SprintSummary, TaskPriority } from '@/types/devflow';

interface TaskModalProps {
  isOpen: boolean;
  sprints: SprintSummary[];
  defaultSprintId?: string;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function TaskModal({
  isOpen,
  sprints,
  defaultSprintId = '',
  onClose,
  onTaskCreated,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [description, setDescription] = useState('');
  const [sprintId, setSprintId] = useState(defaultSprintId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a task title before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          description: description.trim() || null,
          priority,
          status: 'TO_DO',
          sprintId: sprintId || null,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrorMessage(data.error || 'Could not create task. Please try again.');
        return;
      }

      setTitle('');
      setDescription('');
      setPriority('Medium');
      setSprintId(defaultSprintId);
      onTaskCreated();
      onClose();
    } catch {
      setErrorMessage('Network error while creating task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 id="create-task-modal-title" className="mb-4 text-lg font-bold text-slate-900">
          Create New Task
        </h3>

        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800"
          >
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              placeholder="e.g. Build Kanban UI"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-priority"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-sprint"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Sprint
              </label>
              <select
                id="task-sprint"
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="">No Sprint (Backlog)</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              placeholder="Task details..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}