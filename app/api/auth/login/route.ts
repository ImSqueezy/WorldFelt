import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPasscode, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, passcode } = await request.json();

    // Validation
    if (!username || !passcode) {
      return NextResponse.json(
        { error: 'Username and passcode are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or passcode' },
        { status: 401 }
      );
    }

    // Verify passcode
    const isValid = await verifyPasscode(passcode, user.passcode);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or passcode' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
