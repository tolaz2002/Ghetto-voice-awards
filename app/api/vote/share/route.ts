import { NextRequest, NextResponse } from 'next/server';
import { recordShareTask, getVoterSession } from '@/lib/db';
import { ShareTasks } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body.sessionId || req.cookies.get('gva_session')?.value;
    const taskKey = body.taskKey as keyof ShareTasks;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing session' }, { status: 400 });
    }

    const validKeys: (keyof ShareTasks)[] = ['contact1', 'contact2', 'contact3', 'group1', 'group2'];
    if (!validKeys.includes(taskKey)) {
      return NextResponse.json({ success: false, message: 'Invalid share task' }, { status: 400 });
    }

    const session = getVoterSession(sessionId);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    const result = recordShareTask(sessionId, taskKey);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
