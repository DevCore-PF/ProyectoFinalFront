import {
  GetAllCoursesAdminParams,
  registerAdminForm,
} from "@/types/admin.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsersService = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getActiveUsersService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios activos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getInactiveUsersService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios activos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserByIdService = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al conseguir usuario por id");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deactivateUserService = async (
  userId: string,
  token: string,
  banReason: string
) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: banReason }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messege || "Error al benear usurio");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activateUserService = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/activate/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messge || "Error al activar usuario");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activateDeactivateCourseService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar estado de curso");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changeVisivilityService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/courses/change/visibility/${courseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar estado de curso");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCourseFeedbackService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/course-feedback/${courseId}/feedbacks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener feedback");
    }
    const data = await response.json();
    console.log("estos son mis feedbacks", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCoursesAdminService = async (
  token: string,
  params?: GetAllCoursesAdminParams
) => {
  try {
    // Construir los query parameters
    const queryParams = new URLSearchParams();

    if (params?.title) {
      queryParams.append("title", params.title);
    }
    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.difficulty) {
      queryParams.append("difficulty", params.difficulty);
    }
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }
    if (params?.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }

    const response = await fetch(
      `${API_URL}/courses/admin${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener cursos desde admin");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProfessorByIdService = async (
  token: string,
  userId: string
) => {
  try {
    const response = await fetch(`${API_URL}/profiles/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener perfil del profesor");
    }
    const data = await response.json();
    console.log("esta es la respuesta de cursos del profe", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllProfessorProfilesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/profiles/profesor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener pefiles de profesor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveProfileService = async (
  token: string,
  profileId: string
) => {
  try {
    const response = await fetch(`${API_URL}/profiles/aproved/${profileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al aprovar perfil");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const rejectProfileService = async (
  token: string,
  professorId: string,
  reason: string
) => {
  try {
    const response = await fetch(`${API_URL}/profiles/decline/${professorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: reason }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messege || "Error al rechazar perfil");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveCourseService = async (token: string, courseId: string) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/aproved`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messege || "Error al aprobar curso");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const rejectCourseService = async (
  token: string,
  courseId: string,
  reason: string
) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/decline`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messege || "Error al rechazar curso");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerAdminSerivice = async (
  token: string,
  values: registerAdminForm
) => {
  try {
    const response = await fetch(`${API_URL}/auth/register/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mesgage || "Error al registrar administrador");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllSalesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/sales/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los pagos");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis pagos ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllSalesPendingService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/sales/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los pagos pendientes");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis pagos pendientes ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllSalesPaidService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/sales/paid`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los pagos pagados");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis pagos pagados ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createBatchService = async (
  token: string,
  professorId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/admin/payouts/create-batch/${professorId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear lote");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markAsPaidService = async (
  token: string,
  payoutId: string,
  referenceNumber: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/admin/payouts/mark-paid/${payoutId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referenceNumber }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al marcar como pagado");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPendingSummaryService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/pending-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los lotes creados");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis lotes creados ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllBatchesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/batches/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los lotes ");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis lotes ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPendingBatchesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/batches/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los lotes pendientes");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis lotes pendientes ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPaidBatchesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/batches/paid`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los lotes pagos");
    }
    const data = await response.json();
    console.log("Esta es la respuesta de todos mis lotes pagos ", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// /**
//  * Endpoint 1: Obtiene TODOS los lotes de pago (Pagados y Pendientes)
//  */
// @Get('batches/all')
// async getAllBatches() {
//     return this.payoutService.getPayoutBatches(); // Sin filtro
// }

// /**
//  * Endpoint 2: Obtiene solo lotes PENDIENTES
//  */
// @Get('batches/pending')
// async getPendingBatches() {
//     return this.payoutService.getPayoutBatches(PayoutStatus.PENDING);
// }

// /**
//  * Endpoint 3: Obtiene solo lotes YA PAGADOS
//  */
// @Get('batches/paid')
// async getPaidBatches() {
//     return this.payoutService.getPayoutBatches(PayoutStatus.PAID);
// }
