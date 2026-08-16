import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USUARIOS = [
  {
    id: 1,
    usuario: "admin",
    password: "admin123",
    nombre: "Administrador",
    rol: "admin",
  },
  {
    id: 2,
    usuario: "estudiante",
    password: "estudiante123",
    nombre: "Estudiante de la Banda",
    rol: "estudiante",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("banda_usuario");

    if (usuarioGuardado) {
      try {
        setUser(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem("banda_usuario");
      }
    }

    setLoading(false);
  }, []);

  const login = (usuario, password) => {
    const usuarioEncontrado = USUARIOS.find(
      (item) =>
        item.usuario.toLowerCase() === usuario.toLowerCase() &&
        item.password === password
    );

    if (!usuarioEncontrado) {
      return {
        success: false,
        message: "Usuario o contraseña incorrectos.",
      };
    }

    const usuarioSesion = {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      nombre: usuarioEncontrado.nombre,
      rol: usuarioEncontrado.rol,
    };

    setUser(usuarioSesion);

    localStorage.setItem(
      "banda_usuario",
      JSON.stringify(usuarioSesion)
    );

    return {
      success: true,
      user: usuarioSesion,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("banda_usuario");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}