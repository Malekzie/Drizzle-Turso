import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private'

const resend = new Resend(RESEND_API_KEY);

export async function ResendEmail(email: string, code: string){
    const { error } = await resend.emails.send({
        from: 'My Digital Bits <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to My Digital Bits',
        html: `
            <H1>Welcome to My Digital Bits</H1>
            <p>We are excited to have you on board</p>
            <p>Heres your verification code:</p>
            <strong>${code}</strong>
        `
    })

    if (error) {
        console.error(error); 
        return { success: false, message: 'Failed to send verification code' }
    }

    return { success: true, message: 'Verification code sent'}
}