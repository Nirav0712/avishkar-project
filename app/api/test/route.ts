



import { NextResponse } from 'next/server';

// Test route - for development/debugging
export async function GET() {
    return NextResponse.json({ message: 'API is working' });
}
