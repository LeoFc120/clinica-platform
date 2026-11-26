const GRAPH_API_VERSION = 'v21.0';

const normalizePhoneForMeta = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('521') && digits.length === 13) {
    return `52${digits.slice(3)}`;
  }
  return digits;
};

export const sendMessage = async (to: string, text: string): Promise<void> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error('Faltan WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN en .env');
  }

  const normalizedTo = normalizePhoneForMeta(to);
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizedTo,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error enviando mensaje a WhatsApp (${response.status}): ${errorBody}`);
  }
};