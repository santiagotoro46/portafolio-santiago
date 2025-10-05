import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {


    try {
        const form = await request.formData();

        const name = (form.get('name') as string) || '';
        const email = (form.get('email_id') as string) || '';
        const phone = (form.get('phone')) as string || '';
        const message = (form.get('description') as string) || '';

        if (!name || !email || !message) {
            console.warn('⚠️ Faltan campos', { name, email, message });
            return new Response(
                JSON.stringify({ success: false, error: 'Faltan campos obligatorios' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const r = await resend.emails.send({
            subject: `${name} ¡te ha contactado desde tu portafolio!`,
            from: 'Portafolio <onboarding@resend.dev>',
            to: 'santiagotoro4621@gmail.com',
            html: `
        <!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="background-color:#0a0a0f; font-family:Arial, Helvetica, sans-serif; color:#f2f2f7; margin:0; padding:40px 20px;">
    <body style="background-color:#0a0a0f; font-family:Arial, Helvetica, sans-serif; color:#f2f2f7; margin:0; padding:40px 20px;">
    <div style="max-width:600px; margin:0 auto; background-color:#11121a; border-radius:12px; padding:30px; border:1px solid #1e1e1e;">
        <h2 style="color:#2563eb; text-align:center; margin-bottom:20px;">¡Hola Santiago! 👀</h2>

        <p style="font-size:15px; line-height:1.6; color:#a1a1aa; text-align:center; margin-bottom:25px;">
            Alguien acaba de contactarte desde tu portafolio. Aquí tienes los detalles del mensaje:
        </p>

        <div style="background-color:#181a24; border:1px solid #2a2a2a; border-radius:8px; padding:20px;">
            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:12px; font-size:15px;"><b style="color:#2563eb;">Nombre:</b> ${name}</li>
                <li style="margin-bottom:12px; font-size:15px;"><b style="color:#2563eb;">Contacto:</b> ${phone}</li>
                <li style="margin-bottom:12px; font-size:15px;"><b style="color:#2563eb;">Email:</b> ${email}</li>
            </ul>

            <div style="background:#10121b; border-left:3px solid #2563eb; padding:15px; margin-top:20px; border-radius:4px; font-style:italic;">
            ${message}
            </div>
        </div>

        <div style="text-align:center; font-size:13px; color:#a1a1aa; margin-top:25px; border-top:1px solid #1e1e1e; padding-top:15px;">
            ✉️ Este correo fue generado a través de tu portafolio.<br /><br />
            <a href="https://tuportafolio.com" style="color:#2563eb; text-decoration:none;">Visitar portafolio</a><br />
            © 2025 Portafolio Santiago Toro
        </div>
    </div>
</body>

    </body>
</html>`,
    });

        if (!r?.data?.id) {
            return new Response(
                JSON.stringify({ success: false, error: 'Resend no devolvió un ID' }),
                { status: 502, headers: { 'content-type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, id: r.data.id }),
            { status: 200, headers: { 'content-type': 'application/json' } }
        );
    } catch (e: any) {
        console.error('🔥 /api/send-email ERROR:', e);
        return new Response(
            JSON.stringify({ success: false, error: e?.message || String(e) }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        );
    }
};
