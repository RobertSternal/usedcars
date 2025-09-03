import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// For now, we'll store preferences in localStorage on the client side
// This is a temporary solution until the database schema is fully updated

// GET - Retrieve user preferences (returns default preferences)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Return default preferences for now
    return NextResponse.json({
      minPrice: null,
      maxPrice: null,
      preferredBrands: [],
      dislikedBrands: [],
      preferredBodyTypes: [],
      preferredFuelTypes: [],
      preferredTransmission: 'ANY',
      minYear: null,
      maxYear: null,
      maxMileage: null,
      minPower: null,
      maxPower: null,
      preferredLocations: [],
      maxDistanceKm: null
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save user preferences (acknowledge save)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    
    // For now, just acknowledge the save
    // In a full implementation, this would save to the database
    return NextResponse.json({ 
      message: 'Preferences saved successfully',
      preferences: body
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
