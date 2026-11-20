import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'DONE'];
const VALID_PRIORITIES = ['High', 'Medium', 'Low'];

interface UpdateTaskBody {
  status?: string;
  title?: string;
  description?: string | null;
  priority?: string;
  sprintId?: string | null;
  assigneeId?: string | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        sprint: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateTaskBody;

    const existing = await prisma.task.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const trimmedTitle = body.title?.trim();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(body.status && VALID_STATUSES.includes(body.status) ? { status: body.status } : {}),
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
        ...(body.description !== undefined
          ? { description: body.description?.trim() ? body.description.trim() : null }
          : {}),
        ...(body.priority && VALID_PRIORITIES.includes(body.priority)
          ? { priority: body.priority }
          : {}),
        ...(body.sprintId !== undefined
          ? { sprintId: body.sprintId?.trim() ? body.sprintId.trim() : null }
          : {}),
        ...(body.assigneeId !== undefined
          ? { assigneeId: body.assigneeId?.trim() ? body.assigneeId.trim() : null }
          : {}),
      },
      include: {
        assignee: true,
        sprint: true,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.task.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}