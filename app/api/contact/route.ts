import { contactFormSchema } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

// Placeholder implementation - Replace with actual Resend integration when API key is available
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate with Zod
    const validatedData = contactFormSchema.parse(data);

    // For now, just log the data (in production, use Resend or another email service)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      ...validatedData,
    });

    // In production, you would:
    // 1. Send an email using Resend API
    // 2. Save to a database
    // 3. Send confirmation email to user

    // Placeholder response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again.',
      },
      { status: 400 }
    );
  }
}
