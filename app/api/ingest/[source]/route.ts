import { NextResponse } from 'next/server';
import { runIngest } from '@/lib/ingest/run';

function authorize(request: Request): boolean {
  const secret = process.env.INGEST_SECRET;
  const header =
    request.headers.get('authorization') ||
    request.headers.get('x-ingest-secret') ||
    '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (secret) return bearer === secret;
  return process.env.NODE_ENV !== 'production';
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ source: string }> },
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { source } = await params;
  const body = await request.json().catch(() => ({}));
  const liveJobBank = Boolean(body.live);
  const west = Boolean(body.west) || body.regions === 'west';
  const results = await runIngest({ source, liveJobBank, west });
  return NextResponse.json({ results });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ source: string }> },
) {
  return POST(request, context);
}
