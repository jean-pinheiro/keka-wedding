import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface PixInfo {
  qrUrl?: string
  linkUrl?: string
  instructions?: string
}

export async function sendGiftReservedEmail(
  to: string,
  giftName: string,
  guestName: string,
  opts?: { pixInfo?: PixInfo },
) {
  const pixSection = opts?.pixInfo
    ? `
    <div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
      <h3>Informações para Pagamento via Pix</h3>
      ${opts.pixInfo.instructions ? `<p>${opts.pixInfo.instructions}</p>` : ""}
      ${opts.pixInfo.qrUrl ? `<img src="${opts.pixInfo.qrUrl}" alt="QR Code Pix" style="max-width: 200px;">` : ""}
      ${opts.pixInfo.linkUrl ? `<p><a href="${opts.pixInfo.linkUrl}" target="_blank">Link para Pagamento Pix</a></p>` : ""}
    </div>
  `
    : ""

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Presente Reservado com Sucesso!</h2>
      <p>Olá ${guestName},</p>
      <p>Obrigado por reservar o presente: <strong>${giftName}</strong></p>
      <p>Sua reserva foi confirmada e o presente está guardado para você.</p>
      ${pixSection}
      <p>Com carinho,<br>Os Noivos</p>
    </div>
  `

  await resend.emails.send({
    from: "noreply@" + (process.env.NEXT_PUBLIC_SITE_URL?.replace("https://", "") || "localhost"),
    to,
    subject: `Presente Reservado: ${giftName}`,
    html,
  })
}

export async function sendRSVPConfirmationEmail(to: string, guestName: string, attending: boolean, message?: string) {
  const attendingText = attending ? "confirmou presença" : "informou que não poderá comparecer"
  const messageSection = message
    ? `
    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
      <h4>Sua mensagem:</h4>
      <p style="font-style: italic;">"${message}"</p>
    </div>
  `
    : ""

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Confirmação de Presença Recebida</h2>
      <p>Olá ${guestName},</p>
      <p>Recebemos sua confirmação e você <strong>${attendingText}</strong> ao nosso casamento.</p>
      ${
        attending
          ? "<p>Estamos muito felizes em saber que você estará conosco neste dia especial!</p>"
          : "<p>Sentiremos sua falta, mas entendemos. Obrigado por nos avisar.</p>"
      }
      ${messageSection}
      <p>Com carinho,<br>Os Noivos</p>
    </div>
  `

  await resend.emails.send({
    from: "noreply@" + (process.env.NEXT_PUBLIC_SITE_URL?.replace("https://", "") || "localhost"),
    to,
    subject: attending ? "Presença Confirmada - Nosso Casamento" : "Confirmação Recebida - Nosso Casamento",
    html,
  })
}

export async function notifyOwner(subject: string, html: string) {
  // For now, we'll use a placeholder email. In production, this should be configurable
  const ownerEmail = process.env.OWNER_EMAIL || "admin@example.com"

  await resend.emails.send({
    from: "noreply@" + (process.env.NEXT_PUBLIC_SITE_URL?.replace("https://", "") || "localhost"),
    to: ownerEmail,
    subject,
    html,
  })
}
