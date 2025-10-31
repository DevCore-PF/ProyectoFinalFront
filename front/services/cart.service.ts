const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getCart = async (token: string) => {
  const response = await fetch(`${API_URL}/courses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el carrito");
  }

  return response.json();
};

export const addToCartService = async (token: string, courseId: string) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    throw new Error("Error al agregar al carrito");
  }

  return response.json();
};

export const removeFromCart = async (token: string, courseId: string) => {
  const response = await fetch(`${API_URL}/cart/remove/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al quitar del carrito");
  }

  return response.json();
};

export const clearCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al limpiar el carrito");
  }

  return response.json();
};
