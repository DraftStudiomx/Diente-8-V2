import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// Leaves the draft preview and returns to the published page.
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const back = request.nextUrl.searchParams.get('to');
  const target = back && back.startsWith('/') && !back.startsWith('//') ? back : '/';
  return NextResponse.redirect(new URL(target, request.url));
}
