export const runtime = "nodejs";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transporter, mailOptions } from '@/lib/nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save to database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
      },
    })

    // Send email notifications
    try {
      const emailStyles = `
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #334155;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      `;

      const headerStyles = `
        background: linear-gradient(to right, #06b6d4, #3b82f6);
        padding: 30px 20px;
        border-radius: 12px 12px 0 0;
        text-align: center;
        margin-bottom: 30px;
      `;

      const titleStyles = `
        color: #ffffff;
        margin: 0;
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
      `;

      const labelStyles = `
        font-weight: bold;
        color: #64748b;
        font-size: 12px;
        text-transform: uppercase;
        margin-bottom: 4px;
        display: block;
      `;

      const valueStyles = `
        font-size: 16px;
        color: #0f172a;
        margin-bottom: 20px;
        display: block;
      `;

      const messageBoxStyles = `
        background-color: #f8fafc;
        border-left: 4px solid #06b6d4;
        padding: 20px;
        border-radius: 4px;
        margin-top: 10px;
      `;

      const footerStyles = `
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        color: #94a3b8;
        font-size: 12px;
      `;

      // 1. Send notification to admin
      await transporter.sendMail({
        ...mailOptions,
        to: process.env.SMTP_USER,
        subject: `✨ New Inquiry: ${service} - ${name}`,
        text: `New Inquiry from ${name}\n\nService: ${service}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
        html: `
          <div style="${emailStyles}">
            <div style="${headerStyles}">
              <h1 style="${titleStyles}">New Inquiry Received</h1>
            </div>
            
            <div style="padding: 0 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <span style="${labelStyles}">Customer Name</span>
                  <span style="${valueStyles}">${name}</span>
                </div>
                <div>
                  <span style="${labelStyles}">Service Requested</span>
                  <span style="${valueStyles}">${service}</span>
                </div>
                <div>
                  <span style="${labelStyles}">Email Address</span>
                  <span style="${valueStyles}"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></span>
                </div>
                <div>
                  <span style="${labelStyles}">Phone Number</span>
                  <span style="${valueStyles}"><a href="tel:${phone}" style="color: #06b6d4; text-decoration: none;">${phone}</a></span>
                </div>
              </div>

              <div style="margin-top: 30px;">
                <span style="${labelStyles}">Message</span>
                <div style="${messageBoxStyles}">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${email}" style="background-color: #06b6d4; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reply to Customer</a>
              </div>
            </div>

            <div style="${footerStyles}">
              <p>This inquiry was sent from the SaSa Cleaners website contact form.</p>
            </div>
          </div>
        `,
      });

      // 2. Send confirmation to user
      await transporter.sendMail({
        ...mailOptions,
        to: email,
        subject: 'We received your inquiry! - SaSa Cleaners',
        text: `Hi ${name},\n\nThank you for contacting SaSa Cleaners. We have received your inquiry regarding ${service} and will get back to you shortly.\n\nBest regards,\nSaSa Cleaners Team`,
        html: `
          <div style="${emailStyles}">
            <div style="${headerStyles}">
              <h1 style="${titleStyles}">Thank You!</h1>
            </div>
            
            <div style="padding: 0 20px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for reaching out to <strong>SaSa Cleaners</strong>. We have received your inquiry regarding <strong>${service}</strong>.
              </p>

              <div style="${messageBoxStyles}">
                <p style="margin: 0; color: #64748b; font-size: 14px;">We typically respond within 24 hours. If your matter is urgent, please feel free to call us directly.</p>
              </div>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The SaSa Cleaners Team</strong>
              </p>
            </div>

            <div style="${footerStyles}">
              <p>&copy; ${new Date().getFullYear()} SaSa Cleaners. All rights reserved.</p>
              <p>123 Clean Street, Sparkle City, SC 12345</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Continue execution even if email fails, as the inquiry is saved in DB
    }

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', id: inquiry.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
