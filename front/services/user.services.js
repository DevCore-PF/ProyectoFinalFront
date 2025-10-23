const userRegisterService = (userData) => {
  return {
    success: true,
    user: {
      id: "123",
      nombre: userData.nombre,
      email: userData.email,
      rol: "alumno",
    },
    token: "fake-token",
  };
};
const userLoginService = () => {
  return {
    success: true,
    user: {
      id: "123",
      nombre: "Usuario Prueba",
      email: credentials.email,
      rol: "alumno",
    },
    token: "fake-token",
  };
};
