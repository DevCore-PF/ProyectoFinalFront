export interface ContactForm {
  name: string;
  email: string;
  reason: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function sendContactForm(data: ContactForm) {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw { response: { data: errorData } };
  }
  return res.json();
}
