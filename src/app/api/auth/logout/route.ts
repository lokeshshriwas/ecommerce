import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/actions/auth'; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    await logoutUser();
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}
