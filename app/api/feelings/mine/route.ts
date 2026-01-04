import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';

// GET /api/feelings/mine - Get current user's feelings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const feelings = await prisma.feeling.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feelings);
  } catch (error) {
    console.error('Error fetching user feelings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feelings' },
      { status: 500 }
    );
  }
}

// PUT /api/feelings/mine - Update a feeling's position
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, latitude, longitude } = body;

    if (!id || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: id, latitude, longitude' },
        { status: 400 }
      );
    }

    // Check if the feeling belongs to the user
    const existing = await prisma.feeling.findFirst({
      where: {
        id: parseInt(id),
        userId: payload.userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Feeling not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Update the feeling
    const updated = await prisma.feeling.update({
      where: { id: parseInt(id) },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating feeling:', error);
    return NextResponse.json(
      { error: 'Failed to update feeling' },
      { status: 500 }
    );
  }
}
