import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, company, message, interest, type } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const isDemo    = type === 'demo'
    const subject   = isDemo
      ? `🎯 Demo Request — ${name} (${company || email})`
      : `📬 Contact Form — ${name} (${company || email})`

    const interestLabel: Record<string, string> = {
      medical:    'NexLink MedAI',
      accounting: 'CA Accounting Software',
      both:       'Both Products',
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 10px; padding: 32px; max-width: 560px; margin: 0 auto; border-top: 4px solid #2563eb; }
    h2 { color: #0f172a; margin: 0 0 24px; font-size: 20px; }
    .badge { display: inline-block; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: .08em; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
    td:first-child { color: #64748b; font-weight: 600; width: 140px; white-space: nowrap; }
    td:last-child { color: #0f172a; }
    .message-box { background: #f8fafc; border-left: 3px solid #2563eb; border-radius: 4px; padding: 14px 16px; margin-top: 20px; font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap; }
    .footer { margin-top: 28px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${isDemo ? 'Demo Request' : 'Contact Form'}</div>
    <h2>${isDemo ? 'New Demo Request' : 'New Contact Message'}</h2>
    <table>
      <tr><td>Full Name</td><td>${name}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
      ${phone    ? `<tr><td>Phone</td><td>${phone}</td></tr>` : ''}
      ${company  ? `<tr><td>Company</td><td>${company}</td></tr>` : ''}
      ${interest ? `<tr><td>Interested In</td><td>${interestLabel[interest] ?? interest}</td></tr>` : ''}
    </table>
    <div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    <div class="footer">Sent via MetaVision website — metavision.world</div>
  </div>
</body>
</html>`

    await transporter.sendMail({
      from:    `"MetaVision Website" <${process.env.SMTP_USER}>`,
      to:      'admin@metavision.world',
      replyTo: email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
