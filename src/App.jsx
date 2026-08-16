import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventario from "./pages/admin/Inventario";
import EstudianteDashboard from "./pages/estudiante/EstudianteDashboard";

/*
|--------------------------------------------------------------------------
| RUTA PROTEGIDA
|--------------------------------------------------------------------------
| Verifica:
| 1. Que el sistema haya terminado de cargar.
| 2. Que exista un usuario autenticado.
| 3. Que tenga el rol requerido.
*/
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Mientras se verifica la sesión
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>

        <p>Cargando BandaControl...</p>
      </div>
    );
  }

  // Si no hay usuario, enviar al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere un rol y el usuario no lo tiene
  if (role && user.rol !== role) {
    if (user.rol === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.rol === "estudiante") {
      return <Navigate to="/estudiante" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

/*
|--------------------------------------------------------------------------
| RUTAS DE LA APLICACIÓN
|--------------------------------------------------------------------------
*/
function AppRoutes() {
  return (
    <Routes>

      {/* ============================================================
          LOGIN
      ============================================================ */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ============================================================
          PANEL ADMINISTRADOR
      ============================================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          INVENTARIO
      ============================================================ */}
      <Route
        path="/admin/inventario"
        element={
          <ProtectedRoute role="admin">
            <Inventario />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          PANEL ESTUDIANTE
      ============================================================ */}
      <Route
        path="/estudiante"
        element={
          <ProtectedRoute role="estudiante">
            <EstudianteDashboard />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          RUTA PRINCIPAL
      ============================================================ */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* ============================================================
          RUTA NO ENCONTRADA
      ============================================================ */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

/*
|--------------------------------------------------------------------------
| APP PRINCIPAL
|--------------------------------------------------------------------------
*/
function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <AppRoutes />

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;