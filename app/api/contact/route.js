import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, type, message } = await request.json();

    await resend.emails.send({
      from: 'Kuralara WebFlux <contact@kuralarawebflux.com>',
      to: 'contact@kuralarawebflux.com',
      replyTo: email,
      subject: `New Project Inquiry: ${type || 'General'} from ${name}`,
      html: `
        <h2>New Project Inquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${type}</p>

        <hr/>

        <p>${message}</p>
      `,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}