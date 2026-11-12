'use client';
import React, { useEffect, useState } from 'react';
import TaskCard from '@/components/kanban/TaskCard';
import TaskModal from '@/components/kanban/TaskModal';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    assignee?: { name: string };
}

const COLUMNS = [
    { key: 'TO_DO', label: 'To Do' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'DONE', label: 'Done' },
];

export default function KanbanBoardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTasks(data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sprint Kanban Board</h1>
                    <p className="text-sm text-slate-500">Manage and track your team's active tasks.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
                >
                    + Create Task
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading tasks...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                    {COLUMNS.map((col) => {
                        const columnTasks = tasks.filter((t) => t.status === col.key);
                        return (
                            <div key={col.key} className="bg-slate-100/80 rounded-xl p-4 flex flex-col border border-slate-200">
                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                                    <h3 className="font-semibold text-sm text-slate-700">{col.label}</h3>
                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {columnTasks.length === 0 ? (
                                        <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                                            No tasks
                                        </div>
                                    ) : (
                                        columnTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                id={task.id}
                                                title={task.title}
                                                priority={task.priority}
                                                assigneeName={task.assignee?.name}
                                                status={task.status}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={fetchTasks}
            />
        </div>
    );
}