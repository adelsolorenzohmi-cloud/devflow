'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { SprintWithTasks, TaskItem } from '@/types/devflow';

function getDaysRemaining(endDateIso: string): number {
  const endMs = new Date(endDateIso).getTime();
  const nowMs = Date.now();
  if (Number.isNaN(endMs)) return 0;
  const diffDays = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export default function DashboardPage() {
  const [sprints, setSprints] = useState<SprintWithTasks[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [sprintName, setSprintName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creatingSprint, setCreatingSprint] = useState(false);

  const refreshDashboardData = useCallback(async () => {
    setErrorMessage(null);
    try {
      const [sprintsRes, tasksRes] = await Promise.all([
        fetch('/api/sprints'),
        fetch('/api/tasks'),
      ]);

      if (sprintsRes.ok) {
        const sprintsData = (await sprintsRes.json()) as SprintWithTasks[];
        setSprints(Array.isArray(sprintsData) ? sprintsData : []);
      }

      if (tasksRes.ok) {
        const tasksData = (await tasksRes.json()) as TaskItem[];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      }
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
      setErrorMessage('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialDashboard() {
      setErrorMessage(null);
      try {
        const [sprintsRes, tasksRes] = await Promise.all([
          fetch('/api/sprints'),
          fetch('/api/tasks'),
        ]);

        if (!isCancelled) {
          if (sprintsRes.ok) {
            const sprintsData = (await sprintsRes.json()) as SprintWithTasks[];
            setSprints(Array.isArray(sprintsData) ? sprintsData : []);
          }

          if (tasksRes.ok) {
            const tasksData = (await tasksRes.json()) as TaskItem[];
            setTasks(Array.isArray(tasksData) ? tasksData : []);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading dashboard metrics:', error);
          setErrorMessage('Could not load dashboard data. Please try again.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateSprint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!sprintName.trim() || !startDate || !endDate) {
      setErrorMessage('Please provide a sprint name, start date, and end date.');
      return;
    }

    setCreatingSprint(true);
    try {
      const response = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sprintName.trim(),
          startDate,
          endDate,
          status: 'Active',
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrorMessage(data.error || 'Could not create sprint.');
        return;
      }

      setSprintName('');
      setStartDate('');
      setEndDate('');
      await refreshDashboardData();
    } catch {
      setErrorMessage('Network error while creating sprint.');
    } finally {
      setCreatingSprint(false);
    }
  };

  const activeSprint =
    sprints.find((sprint) => sprint.status === 'Active') ?? sprints[0] ?? null;

  const activeSprintTasks = activeSprint
    ? tasks.filter((task) => task.sprintId === activeSprint.id)
    : tasks;

  const completedCount = activeSprintTasks.filter((task) => task.status === 'DONE').length;
  const totalSprintTasks = activeSprintTasks.length;
  const daysRemaining = activeSprint ? getDaysRemaining(activeSprint.endDate) : 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Sprint Dashboard</h1>
          <p className="text-sm text-slate-600">
            Track sprint velocity, manage sprints, and jump straight into your Kanban board.
          </p>
        </div>

        <Link
          href="/dashboard/board"
          className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-auto"
        >
          Go to Kanban Board →
        </Link>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Active Sprint
          </div>
          <div className="mt-2 truncate text-xl font-bold text-slate-900">
            {loading ? '...' : activeSprint ? activeSprint.name : 'No Sprint Yet'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Completed Tasks
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {loading ? '...' : completedCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sprint Progress
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-700">
            {loading ? '...' : `${completedCount} / ${totalSprintTasks}`}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Days Remaining
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {loading ? '...' : activeSprint ? `${daysRemaining} days` : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-base font-bold text-slate-900">Create New Sprint</h2>
          <form onSubmit={handleCreateSprint} className="space-y-4">
            <div>
              <label
                htmlFor="sprint-name"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Sprint Name *
              </label>
              <input
                id="sprint-name"
                type="text"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                required
                placeholder="e.g. Sprint 2 — Core Board"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="sprint-start"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Start Date *
              </label>
              <input
                id="sprint-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="sprint-end"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                End Date *
              </label>
              <input
                id="sprint-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={creatingSprint}
              className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {creatingSprint ? 'Saving Sprint...' : 'Create Sprint'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-slate-900">All Sprints</h2>

          {loading ? (
            <p className="text-sm text-slate-600">Loading sprints...</p>
          ) : sprints.length === 0 ? (
            <p className="text-sm text-slate-600">
              No sprints created yet. Use the form on the left to start your first sprint.
            </p>
          ) : (
            <div className="space-y-3">
              {sprints.map((sprint) => {
                const sprintTaskCount = tasks.filter((t) => t.sprintId === sprint.id).length;
                const sprintDoneCount = tasks.filter(
                  (t) => t.sprintId === sprint.id && t.status === 'DONE'
                ).length;

                return (
                  <div
                    key={sprint.id}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{sprint.name}</h3>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {sprint.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {new Date(sprint.startDate).toLocaleDateString()} –{' '}
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-xs font-semibold text-slate-700">
                      {sprintDoneCount} / {sprintTaskCount} tasks done
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}