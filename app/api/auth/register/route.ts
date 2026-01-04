import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPasscode, generateToken } from '@/lib/auth';

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

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (passcode.length < 4) {
      return NextResponse.json(
        { error: 'Passcode must be at least 4 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash passcode and create user
    const hashedPasscode = await hashPasscode(passcode);
    const user = await prisma.user.create({
      data: {
        username,
        passcode: hashedPasscode,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
