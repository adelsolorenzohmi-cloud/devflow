import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CreateSprintBody {
    name?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
}

export async function GET() {
    try {
        const sprints = await prisma.sprint.findMany({
            include: {
                tasks: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { startDate: 'desc' },
        });
        return NextResponse.json(sprints, { status: 200 });
    } catch (error) {
        console.error('Error fetching sprints:', error);
        return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreateSprintBody;
        const trimmedName = body.name?.trim();

        if (!trimmedName || !body.startDate || !body.endDate) {
            return NextResponse.json(
                { error: 'Name, startDate, and endDate are required' },
                { status: 400 }
            );
        }

        const parsedStart = new Date(body.startDate);
        const parsedEnd = new Date(body.endDate);

        if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
            return NextResponse.json({ error: 'Invalid date format provided' }, { status: 400 });
        }

        if (parsedEnd < parsedStart) {
            return NextResponse.json(
                { error: 'End date must be on or after the start date' },
                { status: 400 }
            );
        }

        const validStatuses = ['Planned', 'Active', 'Completed'];
        const sprintStatus =
            body.status && validStatuses.includes(body.status) ? body.status : 'Active';

        const newSprint = await prisma.sprint.create({
            data: {
                name: trimmedName,
                startDate: parsedStart,
                endDate: parsedEnd,
                status: sprintStatus,
            },
            include: { tasks: true },
        });

        return NextResponse.json(newSprint, { status: 201 });
    } catch (error) {
        console.error('Error creating sprint:', error);
        return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
    }
}