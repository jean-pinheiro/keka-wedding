import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRsvpGuestEmail(
  email: string,
  firstName: string,
  lastName: string,
  guestsCount: number
) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: email,
      subject: "Confirmação de Presença - Casamento Jessica e Artur",
      html: `
      <!doctype html>
      <html lang="pt-BR">
        <body style="margin:0;padding:0;background:#f6f7f9;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding:28px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;box-shadow:0 6px 24px rgba(0,0,0,0.06);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  
                  <!-- Title -->
                  <tr>
                    <td style="padding:32px 24px 16px 24px;text-align:center;">
                      <h1 style="margin:0;font-family:Ainslay, Georgia, serif;font-size:28px;line-height:1.3;color:#535935;">
                        Obrigado por confirmar sua presença!
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:0 28px 24px 28px;color:#333;">
                      <p style="margin:0 0 14px 0;">Olá <strong>${firstName} ${lastName}</strong>,</p>
                      <p style="margin:0 0 18px 0;">
                        Ficamos muito felizes em saber que você estará presente no nosso casamento!
                      </p>

                      <div style="background:#faf6ef;border:1px solid #e5e7eb;padding:16px 18px;border-radius:12px;margin:16px 0 12px 0;">
                        <h3 style="margin:0 0 10px 0;color:#535935;font:700 16px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                          Detalhes da Recepção Casamento Jessica e Artur
                        </h3>
                        <p style="margin:6px 0;"><strong>Data:</strong> 03/10/2025</p>
                        <p style="margin:6px 0;"><strong>Horário:</strong> 20:00 </p>
                        <p style="margin:6px 0;"><strong>Numero de convidados:</strong> ${guestsCount}</p>
                        <p style="margin:6px 0;"><strong>Local:</strong><a href="https://maps.app.goo.gl/Eyf71JQ9kza7rurm6" style="text-decoration:none"> R. Tereza Cristina, 1976 - Benfica, Fortaleza - CE, 60015-141</a></p>
                      </div>

                      <p style="margin:16px 0 6px 0;">
                        Você também pode conferir nossa lista de presentes e outras informações no site.
                      </p>

                      <div style="text-align:center;margin-top:26px;">
                        <a href="${
                          process.env.NEXT_PUBLIC_SITE_URL ||
                          "http://localhost:3000"
                        }"
                          style="background:#C96E2D;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;display:inline-block;font-weight:600;">
                          Visitar Site do Casamento
                        </a>
                      </div>

                      <p style="margin:28px 0 0 0;font-size:14px;color:#535935;text-align:center;font-style:italic;">
                        Com carinho,<br> Jessica & Artur ❤️
                      </p>

                      <p style="margin: 35px 0 0px 0;font-size: 12px;">
                        Este é um e-mail automático, por favor, não responda.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
`,
    });
  } catch (error) {
    console.error("Failed to send RSVP guest email:", error);
    throw error;
  }
}

export async function notifyRsvpAdmin(name: string, guestsCount: number) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: process.env.ADMIN_EMAIL!,
      subject: "Nova Confirmação de Presença - Casamento",
      html: `
      <!doctype html>
      <html lang="pt-BR">
        <body style="margin:0;padding:0;background:#f6f7f9;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding:28px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.06);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  <!-- Header -->
                  <tr>
                    <td style="background:#535935;padding:18px 24px;">
                      <h1 style="margin:0;font:700 20px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#fff;">
                        Nova Confirmação de Presença
                      </h1>
                    </td>
                  </tr>
      
                  <!-- Body -->
                  <tr>
                    <td style="padding:24px 28px;color:#333;">
                      <div style="background:#f7f9fb;border:1px solid #53593520;padding:16px 18px;border-radius:12px;margin:8px 0 12px 0;">
                        <h3 style="margin:0 0 10px 0;color:#535935;font:700 16px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                          Detalhes do Convidado
                        </h3>
                        <p style="margin:6px 0;"><strong>Nome:</strong> ${name}</p>
                        <p style="margin:6px 0;"><strong>Numero total de convidados:</strong> ${guestsCount}</p>
                        <p style="margin:6px 0;"><strong>Status:</strong> Confirmado</p>
                        <p style="margin:6px 0;"><strong>Data:</strong> ${new Date().toLocaleString(
                          "pt-BR"
                        )}</p>
                      </div>
      
                      <div style="text-align:center;margin-top:26px;">
                        <a href="${
                          (process.env.NEXT_PUBLIC_SITE_URL ||
                            "http://localhost:3000") + "/admin"
                        }"
                           style="background:#C96E2D;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;display:inline-block;">
                          Ver Painel Admin
                        </a>
                      </div>
      
                      <p style="margin:28px 0 0 0;font-size:12px;color:#8b8b8b;text-align:center;">
                        Enviado automaticamente pelo site
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send RSVP admin notification :", error);
    throw error;
  }
}

export async function notifyOwner(subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: process.env.ADMIN_EMAIL!,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${html}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Enviado automaticamente pelo site do casamento<br>
            ${new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send owner notification:", error);
    throw error;
  }
}
