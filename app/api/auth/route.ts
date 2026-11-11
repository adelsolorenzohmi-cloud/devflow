import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ status: 'Authenticated', user: { name: 'Masango', role: 'Lead Developer' } }, { status: 200 });
}
