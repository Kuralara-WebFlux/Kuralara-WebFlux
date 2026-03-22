import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, type, message } = data;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure your email transporter (e.g., using Gmail, Brevo, AWS SES)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., contact@kuralarawebflux.com
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Send the email to yourself
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'contact@kuralarawebflux.com',
      subject: `New Project Inquiry: ${type} from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Project Type: ${type}
        
        Message:
        ${message}
      `,
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}