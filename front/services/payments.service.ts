// src/services/paymentsService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const createCheckoutSession = async (
  token: string,
  courseIds: string[]
) => {
  const response = await fetch(`${API_URL}/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseIds }), // Aquí va courseIds (plural)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear sesión de pago");
  }

  return response.json(); // { url: "https://checkout.stripe.com/..." }
};
