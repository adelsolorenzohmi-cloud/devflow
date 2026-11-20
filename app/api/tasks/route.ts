import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'DONE'];
const VALID_PRIORITIES = ['High', 'Medium', 'Low'];

interface CreateTaskBody {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  assigneeId?: string | null;
  sprintId?: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const sprintId = searchParams.get('sprintId');

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && VALID_STATUSES.includes(status) ? { status } : {}),
        ...(priority && VALID_PRIORITIES.includes(priority) ? { priority } : {}),
        ...(sprintId ? { sprintId } : {}),
      },
      include: {
        assignee: true,
        sprint: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTaskBody;
    const trimmedTitle = body.title?.trim();

    if (!trimmedTitle) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const taskStatus =
      body.status && VALID_STATUSES.includes(body.status) ? body.status : 'TO_DO';
    const taskPriority =
      body.priority && VALID_PRIORITIES.includes(body.priority) ? body.priority : 'Medium';

    const normalizedDescription = body.description?.trim() ? body.description.trim() : null;
    const normalizedAssigneeId = body.assigneeId?.trim() ? body.assigneeId.trim() : null;
    const normalizedSprintId = body.sprintId?.trim() ? body.sprintId.trim() : null;

    const newTask = await prisma.task.create({
      data: {
        title: trimmedTitle,
        description: normalizedDescription,
        status: taskStatus,
        priority: taskPriority,
        assigneeId: normalizedAssigneeId,
        sprintId: normalizedSprintId,
      },
      include: {
        assignee: true,
        sprint: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}