import { GetAllCoursesAdminParams, registerAdminForm } from "@/types/admin.types";

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

export const deactivateUserService = async (userId: string, token: string, banReason: string) => {
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

export const activateDeactivateCourseService = async (token: string, courseId: string) => {
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

export const changeVisivilityService = async (token: string, courseId: string) => {
  try {
    const response = await fetch(`${API_URL}/courses/change/visibility/${courseId}`, {
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

export const getCourseFeedbackService = async (token: string, courseId: string) => {
  try {
    const response = await fetch(`${API_URL}/course-feedback/${courseId}/feedbacks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener feedback");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCoursesAdminService = async (token: string, params?: GetAllCoursesAdminParams) => {
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
      `${API_URL}/courses/admin${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
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

export const getProfessorByIdService = async (token: string, userId: string) => {
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

export const approveProfileService = async (token: string, profileId: string) => {
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

export const rejectProfileService = async (token: string, professorId: string, reason: string) => {
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

export const rejectCourseService = async (token: string, courseId: string, reason: string) => {
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

export const registerAdminSerivice = async (token: string, values: registerAdminForm) => {
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

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createBatchService = async (token: string, professorId: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/create-batch/${professorId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear lote");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markAsPaidService = async (token: string, payoutId: string, referenceNumber: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/payouts/mark-paid/${payoutId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ referenceNumber }),
    });
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

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAbandonedCartDashboardService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/settings/abandoned-cart-dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los carritos abandonados");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAbandonedCartSettingsService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/settings/abandoned-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los carritos abandonados");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAbandonedCartSettingsService = async (
  token: string,
  settings: { isEnabled?: boolean; delayHours?: string }
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/abandoned-cart`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error("Error updating abandoned cart settings");
  }

  return response.json();
};

export const triggerAllRemindersService = async (token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/trigger-all-reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error triggering abandoned cart emails");
  }

  return response.json();
};

export const approveTeacherService = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/profiles/approved-teacher/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al aprobar usuario");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const rejectTeacherService = async (token: string, userId: string, reason: string) => {
  console.log("ID para API: ", userId, typeof userId);
  try {
    const response = await fetch(`${API_URL}/profiles/reject-teacher/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al rechazar usuario");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// /profiles/approved-teacher/{userId}
// /profiles/reject-teacher/{userId}
/**
 * Endpoint para aprobar al usuario cambie de rol de alumno a profesor
 */
// @Patch('approved-teacher/:userId')
// @ApiApproveTeacherDoc()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Roles('admin')
// async approvedTeacherRequest(@Param('userID', ParseUUIDPipe) userId: string) {
//   return this.profilesService.approvedTeacherRequest(userId);
// }

// /**
//  * Endpoint para rechazar la solicitud de cambio de rol de alumno a profesor
//  */
// @Patch('reject-teacher/:userId')
// @ApiRejectTeacherDoc()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Roles('admin')
// async rejectTeacherRequest(
//   @Param('userID', ParseUUIDPipe) userId: string,
//   @Body() rejectDto: RejectRequestDto,
// ) {
//   return this.profilesService.rejectTeacherRequest(userId, rejectDto);
// }
// async approvedTeacherRequest(userId: string) {
//   //Buscamos al ususrio(por su perfil de profesor)
//   const user = await this.userRepository.findUserWithProfile(userId);

//   if(!user) {
//     throw new NotFoundException('Usuario no encontrado')
//   }

//   const profile = user.professorProfile;
//   if(!profile) {
//     throw new NotFoundException('Este usuario no tienes una solicitud de perfil de profesor')
//   }

//   if(profile.approvalStatus !== ApprovalStatus.PENDING){
//     throw new ConflictException('Esta solicitud ya fue procesada')
//   }

//   //actualizamos su estatus
//   profile.approvalStatus = ApprovalStatus.APPROVED;

//   //cambiamos el rol
//   user.role = UserRole.TEACHER;
//   //regreamos a false la solicitud
//   user.isRequestingTeacherRole = false;

//   //guardamos en los cambios
//   await this.profilesRepository.save(profile);
//   await this.userRepository.save(user);

//   try {
//     await this.mailService.sendRoleRequestApprovedEmail(user.email, user.name, "Profesor")
//   } catch(emailError) {
//     throw new BadRequestException('Error al enviar el email de solicitud de profesor:', emailError)
//   }

//   return {
//     message: 'Solicitud de ascenso a profesor aprobada correctamente'
//   }

// }

// /**
//  * MEtodo que rechaza el cambio de rol de estudiante a profesor
//  */
// async rejectTeacherRequest(userId: string, rejectDto: RejectRequestDto){
//   const {reason} = rejectDto;

//   //buscamos al usuario y su perfil
//   const user = await this.userRepository.findUserWithProfile(userId);

//   if(!user) {
//     throw new NotFoundException('Usuario no encontrado')
//   }

//   const profile = user.professorProfile;

//   if(!profile) {
//     throw new NotFoundException('Este usuario no tiene un solicitud de cambio de rol')
//   }

//   //valida que la solicitud este en pendiente
//   if(profile.approvalStatus !== ApprovalStatus.PENDING) {
//     throw new ConflictException('Esta solicitud ya fue procesada (aprobada o rechazada')
//   }

//   //actualizamos el perfil con el estado y motivo del rechazo
//   profile.approvalStatus = ApprovalStatus.REJECTED;
//   profile.rejectionReason = reason;

//   //regresamos a false
//   user.isRequestingTeacherRole = false;

//   //enviamos el email de rechazo
//   try {
//     await this.mailService.sendRoleRequestRejectedEmail(user.email, user.name, reason)
//   } catch(emailError) {
//     throw new BadRequestException(`Solicitud de rol rechazada para el ${user.id}, pero fallo el envio del email`, emailError)
//   }

//   return {
//     message: 'Solicitud rechazada exitosamente'
//   }
// }
