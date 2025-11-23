import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest,) {
  try {

    const db = await getDB();
    const results = await db.collection('results').find().toArray();

   
    return NextResponse.json({
     success:true,
     results
    });


  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
