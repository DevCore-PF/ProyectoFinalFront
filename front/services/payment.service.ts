const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const paymentService = {
  createCheckoutSession: async (token: string, courseIds: string[]) => {
    const response = await fetch(
      `${API_URL}/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseIds }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear sesión de pago");
    }

    return response.json();
  },
};
