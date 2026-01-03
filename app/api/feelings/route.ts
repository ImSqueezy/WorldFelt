import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feelings - Get all feelings
export async function GET() {
  try {
    const feelings = await prisma.feeling.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 feelings for performance
    });

    return NextResponse.json(feelings);
  } catch (error) {
    console.error('Error fetching feelings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feelings' },
      { status: 500 }
    );
  }
}

// POST /api/feelings - Create a new feeling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, feeling, comment } = body;

    // Validate required fields
    if (!latitude || !longitude || !feeling) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude, feeling' },
        { status: 400 }
      );
    }

    // Validate latitude and longitude ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude. Must be between -90 and 90' },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude. Must be between -180 and 180' },
        { status: 400 }
      );
    }

    // Create the feeling
    const newFeeling = await prisma.feeling.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        feeling,
        comment: comment || null,
      },
    });

    return NextResponse.json(newFeeling, { status: 201 });
  } catch (error) {
    console.error('Error creating feeling:', error);
    return NextResponse.json(
      { error: 'Failed to create feeling' },
      { status: 500 }
    );
  }
}
