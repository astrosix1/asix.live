import { contactFormSchema } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'collins.nick999@gmail.com';
const FROM_EMAIL  = process.env.FROM_EMAIL  || 'noreply@asix.live';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = contactFormSchema.parse(data);

    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      ...validatedData,
    });

    if (resend) {
      // Send notification to admin
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Asix.live Contact] ${validatedData.subject || 'New message'}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#1e293b;margin-bottom:4px">New Contact Form Submission</h2>
            <p style="color:#64748b;font-size:13px;margin-bottom:24px">${new Date().toLocaleString()}</p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr><td style="padding:8px 0;color:#64748b;width:100px;font-size:13px">Name</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px"><strong>${validatedData.name}</strong></td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Email</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px"><a href="mailto:${validatedData.email}">${validatedData.email}</a></td></tr>
              ${validatedData.subject ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px">Subject</td>
                  <td style="padding:8px 0;color:#1e293b;font-size:14px">${validatedData.subject}</td></tr>` : ''}
            </table>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px">
              <p style="color:#64748b;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Message</p>
              <p style="color:#1e293b;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap">${validatedData.message}</p>
            </div>

            <a href="mailto:${validatedData.email}?subject=Re: ${validatedData.subject || 'Your message to Asix.live'}"
               style="display:inline-block;background:#3b82f6;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500">
              Reply to ${validatedData.name}
            </a>
          </div>
        `,
      });

      // Send confirmation to user
      await resend.emails.send({
        from: FROM_EMAIL,
        to: validatedData.email,
        subject: "We got your message — Asix.live",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#1e293b">Hey ${validatedData.name} 👋</h2>
            <p style="color:#475569;line-height:1.6">
              Thanks for reaching out! We've received your message and will get back to you within 1–2 business days.
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em">Your message</p>
              <p style="color:#475569;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap">${validatedData.message}</p>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin-top:24px">— The Asix.live Team</p>
          </div>
        `,
      });
    } else {
      // No Resend key — log only (dev mode)
      console.warn('[Contact] RESEND_API_KEY not set. Email not sent.');
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for your message! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again.' },
      { status: 400 }
    );
  }
}
