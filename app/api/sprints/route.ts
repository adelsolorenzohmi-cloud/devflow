import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const sprints = await prisma.sprint.findMany({
            include: { tasks: true },
            orderBy: { startDate: 'desc' },
        });
        return NextResponse.json(sprints, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, startDate, endDate, status } = body;

        if (!name || !startDate || !endDate) {
            return NextResponse.json({ error: 'Name, startDate, and endDate are required' }, { status: 400 });
        }

        const newSprint = await prisma.sprint.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status || 'Active',
            },
            include: { tasks: true },
        });

        return NextResponse.json(newSprint, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
    }
}