const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCartService = async (token: string) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el carrito");
  }

  const data = await response.json();
  
  return data;
};
export const addToCartService = async (token: string, courseId: string) => {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al agregar al carrito");
    }

    return response.json();
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    throw error;
  }
};

export const removeFromCartService = async (token: string, courseId: string) => {
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

export const clearCartService = async (token: string) => {
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
