export interface ContactForm {
  name: string;
  email: string;
  reason: string;
  message: string;
}

export async function sendContactForm(data: ContactForm) {
  const res = await fetch('/api/contact', {
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
