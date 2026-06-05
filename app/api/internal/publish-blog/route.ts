import { createPost } from '@/lib/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const post = await request.json();
    const result = await createPost(post);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to publish' },
      { status: 500 }
    );
  }
}
