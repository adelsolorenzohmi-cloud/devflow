import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tasks = await prisma.task.findMany({
      where: status ? { status } : {},
      include: { assignee: true, sprint: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, assigneeId, sprintId } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const newTask = await prisma.task.create({
      data: { title, description, status: status || 'TO_DO', priority: priority || 'Medium', assigneeId, sprintId },
      include: { assignee: true, sprint: true },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
