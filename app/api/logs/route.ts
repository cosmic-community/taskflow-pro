import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/cosmic';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await getLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs', logs: [] }, { status: 500 });
  }
}