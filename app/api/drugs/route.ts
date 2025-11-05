// app/api/drugs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const drugs = await prisma.drug.findMany({
      where: { userId: user.id },
      include: {
        batches: {
          select: {
            quantityAvailable: true,
          },
        },
      },
    });

    return NextResponse.json({ drugs });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const drug = await prisma.drug.create({
      data: {
        ...body,
        userId: user.id,
      },
    });

    return NextResponse.json({ drug }, { status: 201 });
  } catch (error) {
    console.error('Error creating drug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}