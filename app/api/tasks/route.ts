import { NextResponse } from 'next/server';
import { getAllTasks, createTask, createLog } from '@/lib/cosmic';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks', tasks: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await createTask({
      title: body.title,
      description: body.description || '',
      origin: body.origin || 'Library',
      reward_tokens: body.reward_tokens || 0,
      penalty_tokens: body.penalty_tokens || 0,
      timer_duration: body.timer_duration || 0,
    });
    await createLog(`Task '${body.title}' created in ${body.origin || 'Library'}`);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}