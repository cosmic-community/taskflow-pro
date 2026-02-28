import { NextResponse } from 'next/server';
import { getAppSettings, updateSettings, createLog } from '@/lib/cosmic';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings', settings: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'Settings ID required' }, { status: 400 });
    }

    const settings = await getAppSettings();
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const currentTokens = settings.metadata.global_tokens ?? 0;

    if (action === 'changeTheme') {
      await updateSettings(id, { active_theme: body.themeKey });
      await createLog(`Theme changed to '${body.themeKey}'`);
    } else if (action === 'addTokens') {
      const newTokens = currentTokens + (body.amount || 0);
      await updateSettings(id, { global_tokens: newTokens });
      await createLog(`Manually added ${body.amount} tokens (${currentTokens} → ${newTokens})`);
    } else if (action === 'removeTokens') {
      const newTokens = Math.max(0, currentTokens - (body.amount || 0));
      await updateSettings(id, { global_tokens: newTokens });
      await createLog(`Manually removed ${body.amount} tokens (${currentTokens} → ${newTokens})`);
    } else if (action === 'setTokens') {
      await updateSettings(id, { global_tokens: body.tokens ?? currentTokens });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}