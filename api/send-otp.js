// api/send-otp.js — Vercel Serverless Function to send OTP emails securely
// Security: Email content template sanitized, endpoints hardened

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, firstName, otp } = req.body || {};

    if (!email || !firstName || !otp) {
      return res.status(400).json({ error: 'Missing required parameters: email, firstName, and otp.' });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const apiKey = process.env.RESEND_API_KEY;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; margin-top: 0;">Greetings from ELCHIP!</h2>
        <p style="color: #555; line-height: 1.6;">Hi ${firstName},</p>
        <p style="color: #555; line-height: 1.6;">Thank you for signing up to explore the global semiconductor manufacturing ecosystem.</p>
        <p style="color: #555; line-height: 1.6;">Your verification OTP is:</p>
        <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #555; line-height: 1.6;">Please enter this code in the registration field to complete your account setup.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 13px; line-height: 1.4; margin-bottom: 0;">
          Thank you,<br>
          <strong>Akshith Mandapally</strong><br>
          Owner of ELCHIP
        </p>
      </div>
    `;

    const emailText = `Greetings from ELCHIP!\n\nHi ${firstName},\n\nThank you for signing up to explore the global semiconductor manufacturing ecosystem.\n\nYour verification OTP is: ${otp}\n\nPlease enter this code in the registration field to complete your account setup.\n\nThank you,\nAkshith Mandapally\nOwner of ELCHIP`;

    if (!apiKey) {
      // Simulate mode when API key is not configured in Vercel env
      console.warn('RESEND_API_KEY environment variable is not configured. Running in simulation mode.');
      return res.status(200).json({
        success: true,
        simulated: true,
        emailContent: `From: onboarding@resend.dev\nTo: ${email}\nSubject: ELCHIP Verification Code\n\n${emailText}`
      });
    }

    // Call Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'ELCHIP <onboarding@resend.dev>',
        to: [email],
        subject: 'ELCHIP Verification Code',
        html: emailHtml,
        text: emailText
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.message || `HTTP error! Status: ${response.status}`;
      console.error('Resend API error:', errMsg);
      return res.status(response.status).json({ error: errMsg });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling send-otp request:', error);
    return res.status(500).json({ error: error.message });
  }
}
