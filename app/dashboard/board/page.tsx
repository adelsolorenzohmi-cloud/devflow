'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TaskCard from '@/components/kanban/TaskCard';
import TaskModal from '@/components/kanban/TaskModal';
import type { SprintSummary, TaskItem, TaskStatus } from '@/types/devflow';

interface BoardColumn {
    key: TaskStatus;
    label: string;
}

const COLUMNS: BoardColumn[] = [
    { key: 'TO_DO', label: 'To Do' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'DONE', label: 'Done' },
];

export default function KanbanBoardPage() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [sprints, setSprints] = useState<SprintSummary[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [sprintFilter, setSprintFilter] = useState<string>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshBoardData = useCallback(async () => {
        setErrorMessage(null);
        try {
            const params = new URLSearchParams();
            if (priorityFilter !== 'ALL') {
                params.set('priority', priorityFilter);
            }
            if (sprintFilter !== 'ALL' && sprintFilter !== 'BACKLOG') {
                params.set('sprintId', sprintFilter);
            }

            const queryString = params.toString();
            const tasksUrl = queryString ? `/api/tasks?${queryString}` : '/api/tasks';

            const [tasksRes, sprintsRes] = await Promise.all([
                fetch(tasksUrl),
                fetch('/api/sprints'),
            ]);

            if (!tasksRes.ok) {
                throw new Error('Failed to load tasks');
            }

            const tasksData = (await tasksRes.json()) as TaskItem[];
            let filteredTasks = Array.isArray(tasksData) ? tasksData : [];

            if (sprintFilter === 'BACKLOG') {
                filteredTasks = filteredTasks.filter((task) => !task.sprintId);
            }

            setTasks(filteredTasks);

            if (sprintsRes.ok) {
                const sprintsData = (await sprintsRes.json()) as SprintSummary[];
                setSprints(Array.isArray(sprintsData) ? sprintsData : []);
            }
        } catch (error) {
            console.error('Failed to fetch board data:', error);
            setErrorMessage('Could not load board tasks. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    }, [priorityFilter, sprintFilter]);

    useEffect(() => {
        let isCancelled = false;

        async function loadInitialBoard() {
            setErrorMessage(null);
            try {
                const params = new URLSearchParams();
                if (priorityFilter !== 'ALL') {
                    params.set('priority', priorityFilter);
                }
                if (sprintFilter !== 'ALL' && sprintFilter !== 'BACKLOG') {
                    params.set('sprintId', sprintFilter);
                }

                const queryString = params.toString();
                const tasksUrl = queryString ? `/api/tasks?${queryString}` : '/api/tasks';

                const [tasksRes, sprintsRes] = await Promise.all([
                    fetch(tasksUrl),
                    fetch('/api/sprints'),
                ]);

                if (!tasksRes.ok) {
                    throw new Error('Failed to load tasks');
                }

                const tasksData = (await tasksRes.json()) as TaskItem[];
                let filteredTasks = Array.isArray(tasksData) ? tasksData : [];

                if (sprintFilter === 'BACKLOG') {
                    filteredTasks = filteredTasks.filter((task) => !task.sprintId);
                }

                if (!isCancelled) {
                    setTasks(filteredTasks);
                    if (sprintsRes.ok) {
                        const sprintsData = (await sprintsRes.json()) as SprintSummary[];
                        setSprints(Array.isArray(sprintsData) ? sprintsData : []);
                    }
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error('Failed to fetch board data:', error);
                    setErrorMessage('Could not load board tasks. Please refresh and try again.');
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        void loadInitialBoard();

        return () => {
            isCancelled = true;
        };
    }, [priorityFilter, sprintFilter]);

    const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
        setErrorMessage(null);
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            await refreshBoardData();
        } catch (error) {
            console.error('Failed to update task status:', error);
            setErrorMessage('Could not update task status. Please try again.');
        }
    };

    const handleDeleteTask = async (id: string) => {
        setErrorMessage(null);
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            await refreshBoardData();
        } catch (error) {
            console.error('Failed to delete task:', error);
            setErrorMessage('Could not delete task. Please try again.');
        }
    };

    const defaultModalSprintId =
        sprintFilter !== 'ALL' && sprintFilter !== 'BACKLOG' ? sprintFilter : '';

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sprint Kanban Board</h1>
                    <p className="text-sm text-slate-600">
                        Manage tasks across stages, filter by priority or sprint, and track progress.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-auto"
                >
                    + Create Task
                </button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <label htmlFor="filter-priority" className="text-xs font-semibold text-slate-700">
                        Priority:
                    </label>
                    <select
                        id="filter-priority"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="filter-sprint" className="text-xs font-semibold text-slate-700">
                        Sprint:
                    </label>
                    <select
                        id="filter-sprint"
                        value={sprintFilter}
                        onChange={(e) => setSprintFilter(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none"
                    >
                        <option value="ALL">All Tasks &amp; Sprints</option>
                        <option value="BACKLOG">Backlog (No Sprint)</option>
                        {sprints.map((sprint) => (
                            <option key={sprint.id} value={sprint.id}>
                                {sprint.name}
                            </option>
                        ))}
                    </select>
                </div>

                {(priorityFilter !== 'ALL' || sprintFilter !== 'ALL') && (
                    <button
                        type="button"
                        onClick={() => {
                            setPriorityFilter('ALL');
                            setSprintFilter('ALL');
                        }}
                        className="cursor-pointer text-xs font-semibold text-blue-700 hover:underline"
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
                >
                    {errorMessage}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-600">
                    Loading tasks...
                </div>
            ) : (
                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {COLUMNS.map((col) => {
                        const columnTasks = tasks.filter((task) => task.status === col.key);
                        return (
                            <section
                                key={col.key}
                                aria-label={col.label}
                                className="flex flex-col rounded-xl border border-slate-200 bg-slate-100/80 p-4"
                            >
                                <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h2 className="text-sm font-semibold text-slate-800">{col.label}</h2>
                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
                                        {columnTasks.length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {columnTasks.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-xs text-slate-500">
                                            No tasks
                                        </div>
                                    ) : (
                                        columnTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                id={task.id}
                                                title={task.title}
                                                description={task.description}
                                                priority={task.priority}
                                                assigneeName={task.assignee?.name}
                                                sprintName={task.sprint?.name}
                                                status={task.status}
                                                onStatusChange={handleStatusChange}
                                                onDelete={handleDeleteTask}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                sprints={sprints}
                defaultSprintId={defaultModalSprintId}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={refreshBoardData}
            />
        </main>
    );
}