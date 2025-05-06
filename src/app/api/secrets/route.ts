import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In a real application, this would be a database
const secrets = new Map<string, {
  secret: string;
  expiresAt: Date;
  maxViews: number;
  remainingViews: number;
}>();

export async function POST(request: Request) {
  try {
    const { secret, expiryDays, maxViews } = await request.json();

    // Generate a unique ID for the secret
    const id = crypto.randomBytes(16).toString('hex');
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    // Store the secret
    secrets.set(id, {
      secret,
      expiresAt,
      maxViews,
      remainingViews: maxViews,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Error creating secret:', error);
    return NextResponse.json(
      { error: 'Failed to create secret' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Secret ID is required' },
        { status: 400 }
      );
    }

    const secret = secrets.get(id);

    if (!secret) {
      return NextResponse.json(
        { error: 'Secret not found' },
        { status: 404 }
      );
    }

    // Check if secret has expired
    if (new Date() > secret.expiresAt) {
      secrets.delete(id);
      return NextResponse.json(
        { error: 'Secret has expired' },
        { status: 410 }
      );
    }

    // Check if there are remaining views
    if (secret.remainingViews <= 0) {
      secrets.delete(id);
      return NextResponse.json(
        { error: 'Maximum views exceeded' },
        { status: 410 }
      );
    }

    // Decrease remaining views
    secret.remainingViews--;

    // If this was the last view, delete the secret
    if (secret.remainingViews === 0) {
      secrets.delete(id);
    }

    return NextResponse.json({ secret: secret.secret });
  } catch (error) {
    console.error('Error retrieving secret:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve secret' },
      { status: 500 }
    );
  }
} 