export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'DONE';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export type SprintStatus = 'Planned' | 'Active' | 'Completed';

export interface UserSummary {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface SprintSummary {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: SprintStatus | string;
}

export interface TaskItem {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string | null;
    assignee?: UserSummary | null;
    sprintId: string | null;
    sprint?: SprintSummary | null;
    createdAt: string;
    updatedAt: string;
}

export interface SprintWithTasks extends SprintSummary {
    tasks: TaskItem[];
}