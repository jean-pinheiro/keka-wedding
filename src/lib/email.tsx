import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRsvpGuestEmail(
  email: string,
  firstName: string,
  lastName: string
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #be185d; text-align: center;">Obrigado por confirmar sua presença!</h2>
          
          <p>Olá ${firstName} ${lastName},</p>
          
          <p>Ficamos muito felizes em saber que você estará presente no nosso casamento!</p>
          
          <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #be185d; margin-top: 0;">Detalhes do Evento:</h3>
            <p><strong>Casal:</strong> Jessica e Artur</p>
            <p><strong>Data:</strong> [Data do casamento]</p>
            <p><strong>Local:</strong> [Local do casamento]</p>
          </div>
          
          <p>Não esqueça de conferir nossa lista de presentes no site!</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }" 
               style="background-color: #be185d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Visitar Site do Casamento
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Com amor,<br>
            Jessica e Artur ❤️
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send RSVP guest email:", error);
    throw error;
  }
}

export async function notifyRsvpAdmin(
  firstName: string,
  lastName: string,
  email: string
) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: "Nova Confirmação de Presença - Casamento",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #be185d;">Nova Confirmação de Presença</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #be185d;">
            <h3 style="margin-top: 0;">Detalhes do Convidado:</h3>
            <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Status:</strong> Confirmado</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/admin" 
               style="background-color: #be185d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver Painel Admin
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send RSVP admin notification:", error);
    throw error;
  }
}

export async function sendGiftReservationEmail(
  guestEmail: string,
  guestName: string,
  giftName: string,
  giftPrice: number
) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: guestEmail,
      subject: "Presente Reservado - Casamento Jessica e Artur",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #be185d; text-align: center;">Presente Reservado com Sucesso!</h2>
          
          <p>Olá ${guestName},</p>
          
          <p>Obrigado por reservar um presente para o nosso casamento!</p>
          
          <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #be185d; margin-top: 0;">Detalhes da Reserva:</h3>
            <p><strong>Presente:</strong> ${giftName}</p>
            <p><strong>Valor:</strong> R$ ${giftPrice.toFixed(2)}</p>
            <p><strong>Reservado por:</strong> ${guestName}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
          </div>
          
          <p>Ficamos muito gratos pela sua generosidade!</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Com amor,<br>
            Jessica e Artur ❤️
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send gift reservation email:", error);
    throw error;
  }
}

export async function notifyGiftReservationAdmin(
  guestName: string,
  guestEmail: string,
  giftName: string,
  giftPrice: number
) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: "Novo Presente Reservado - Casamento",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #be185d;">Novo Presente Reservado</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #be185d;">
            <h3 style="margin-top: 0;">Detalhes da Reserva:</h3>
            <p><strong>Presente:</strong> ${giftName}</p>
            <p><strong>Valor:</strong> R$ ${giftPrice.toFixed(2)}</p>
            <p><strong>Reservado por:</strong> ${guestName}</p>
            <p><strong>E-mail:</strong> ${guestEmail}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/admin" 
               style="background-color: #be185d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver Painel Admin
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send gift reservation admin notification:", error);
    throw error;
  }
}

export async function sendGiftReservedEmail(
  to: string,
  giftName: string,
  guestName: string,
  opts?: {
    pixInfo?: { qrUrl?: string; linkUrl?: string; instructions?: string };
  }
) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email service not configured");
    return;
  }

  const pixSection = opts?.pixInfo
    ? `
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <h3 style="color: #0ea5e9; margin-top: 0;">Informações para Pagamento via Pix</h3>
      <p>${
        opts.pixInfo.instructions ||
        "Use os dados abaixo para fazer o pagamento via Pix"
      }</p>
      ${
        opts.pixInfo.qrUrl
          ? `<p><img src="${opts.pixInfo.qrUrl}" alt="QR Code Pix" style="max-width: 200px; height: auto;"></p>`
          : ""
      }
      ${
        opts.pixInfo.linkUrl
          ? `<p><a href="${opts.pixInfo.linkUrl}" style="color: #0ea5e9; text-decoration: underline;">Link para Pagamento Pix</a></p>`
          : ""
      }
    </div>
  `
    : "";

  try {
    await resend.emails.send({
      from: process.env.OWNER_EMAIL,
      to: to,
      subject: "Presente Reservado - Casamento Jessica e Artur",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #be185d; text-align: center;">Presente Reservado com Sucesso!</h2>
          
          <p>Olá ${guestName},</p>
          
          <p>Obrigado por reservar um presente para o nosso casamento!</p>
          
          <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #be185d; margin-top: 0;">Detalhes da Reserva:</h3>
            <p><strong>Presente:</strong> ${giftName}</p>
            <p><strong>Reservado por:</strong> ${guestName}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
          </div>
          
          ${pixSection}
          
          <p>Ficamos muito gratos pela sua generosidade!</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Com amor,<br>
            Jessica e Artur ❤️
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send gift reserved email:", error);
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
      to: process.env.OWNER_EMAIL,
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
