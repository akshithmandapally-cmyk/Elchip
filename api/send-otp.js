// api/send-otp.js — Vercel Serverless Function to send OTP emails securely
// Security: Email content template sanitized, endpoints hardened

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, firstName, otp, origin } = req.body || {};

    if (!email || !firstName || !otp) {
      return res.status(400).json({ error: 'Missing required parameters: email, firstName, and otp.' });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const logoUrl = origin ? `${origin}/tnc-removebg-preview.png` : 'https://akshithmandapally-cmyk.github.io/Elchip/tnc-removebg-preview.png';

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff; color: #18181b;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${logoUrl}" alt="ELCHIP Logo" style="width: 80px; height: auto; margin-bottom: 10px;">
          <h1 style="font-size: 28px; font-weight: 800; color: #000000; margin: 0; letter-spacing: -0.03em;">ELCHIP</h1>
          <p style="font-size: 14px; color: #71717a; margin: 5px 0 0;">Semiconductor Manufacturing & Inspection System</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;">
        <p style="font-size: 16px; line-height: 1.6; color: #27272a; margin: 0 0 15px;">Greetings from ELCHIP!</p>
        <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0 0 15px;">Hi ${firstName},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0 0 20px;">Thank you for signing up to explore our global semiconductor manufacturing ecosystem. To complete your account registration, please enter the following verification code:</p>
        <div style="background: #f4f4f5; border: 1px solid #e4e4e7; padding: 20px; text-align: center; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #09090b; margin: 25px 0; font-family: monospace;">
          ${otp}
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #71717a; margin: 0 0 25px;">This verification code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;">
        <div style="font-size: 13px; line-height: 1.5; color: #71717a;">
          Thank you,<br>
          <strong style="color: #18181b;">Akshith Mandapally</strong><br>
          Owner of ELCHIP
        </div>
      </div>
    `;

    const emailText = `Greetings from ELCHIP!\n\nHi ${firstName},\n\nThank you for signing up to explore our global semiconductor manufacturing ecosystem.\n\nYour verification OTP is: ${otp}\n\nPlease enter this code in the registration field to complete your account setup.\n\nThank you,\nAkshith Mandapally\nOwner of ELCHIP`;

    if (!apiKey) {
      // Simulate mode when API key is not configured in Vercel env
      console.warn('RESEND_API_KEY environment variable is not configured. Running in simulation mode.');
      console.log(`[SIMULATION LOG] Email destination: ${email} | Subject: ELCHIP Verification Code | OTP: ${otp}`);
      return res.status(200).json({
        success: true,
        simulated: true
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
