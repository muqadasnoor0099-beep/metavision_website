import { Resend } from 'resend'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, company, message, interest, type } = req.body ?? {}

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const isDemo = type === 'demo'
    const subject = isDemo
      ? `🎯 Demo Request — ${name} (${company || email})`
      : `📬 Contact Form — ${name} (${company || email})`

    const interestLabel: Record<string, string> = {
      medical: 'NexLink MedAI',
      accounting: 'Workflow Management System',
      consulting: 'IT Consulting',
      development: 'Custom Software Development',
      other: 'Other',
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 10px; padding: 32px; max-width: 560px; margin: 0 auto; border-top: 4px solid #d4af37; }
    h2 { color: #0f172a; margin: 0 0 24px; font-size: 20px; }
    .badge { display: inline-block; background: #fdf8e7; color: #b8960a; border: 1px solid #f0d060; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: .08em; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
    td:first-child { color: #64748b; font-weight: 600; width: 140px; white-space: nowrap; }
    td:last-child { color: #0f172a; }
    .message-box { background: #f8fafc; border-left: 3px solid #d4af37; border-radius: 4px; padding: 14px 16px; margin-top: 20px; font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap; }
    .footer { margin-top: 28px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${isDemo ? 'Demo Request' : 'Contact Form'}</div>
    <h2>${isDemo ? 'New Demo Request' : 'New Contact Message'}</h2>
    <table>
      <tr><td>Full Name</td><td>${name}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${email}" style="color:#d4af37">${email}</a></td></tr>
      ${company ? `<tr><td>Company</td><td>${company}</td></tr>` : ''}
      ${interest ? `<tr><td>Interested In</td><td>${interestLabel[interest] ?? interest}</td></tr>` : ''}
    </table>
    <div class="message-box">${String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    <div class="footer">Sent via MetaVision website — metavision.world</div>
  </div>
</body>
</html>`

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'MetaVision Website <onboarding@resend.dev>',
      to: 'admin@metavision.world',
      replyTo: email,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
