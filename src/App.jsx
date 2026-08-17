import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventario from "./pages/admin/Inventario";
import Prestamos from "./pages/admin/Prestamos";
import Usuarios from "./pages/admin/Usuarios";
import EstudianteDashboard from "./pages/estudiante/EstudianteDashboard";


// ============================================================
// RUTA PROTEGIDA
// ============================================================

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // ----------------------------------------------------------
  // CARGANDO SESIÓN
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div className="loading-screen">

        <div className="loading-spinner"></div>

        <p>
          Cargando BandaControl...
        </p>

      </div>
    );
  }

  // ----------------------------------------------------------
  // NO AUTENTICADO
  // ----------------------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ----------------------------------------------------------
  // VALIDAR ROL
  // ----------------------------------------------------------

  if (role && user.rol !== role) {

    if (user.rol === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.rol === "estudiante") {
      return (
        <Navigate
          to="/estudiante"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// ============================================================
// RUTAS DE LA APLICACIÓN
// ============================================================

function AppRoutes() {
  return (
    <Routes>

      {/* ======================================================
          LOGIN
      ====================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ======================================================
          PANEL ADMINISTRADOR
      ====================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          GESTIONAR INVENTARIO
      ====================================================== */}

      <Route
        path="/admin/inventario"
        element={
          <ProtectedRoute role="admin">
            <Inventario />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          GESTIONAR PRÉSTAMOS
      ====================================================== */}

      <Route
        path="/admin/prestamos"
        element={
          <ProtectedRoute role="admin">
            <Prestamos />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          GESTIONAR USUARIOS
      ====================================================== */}

      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute role="admin">
            <Usuarios />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          PANEL ESTUDIANTE
      ====================================================== */}

      <Route
        path="/estudiante"
        element={
          <ProtectedRoute role="estudiante">
            <EstudianteDashboard />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          RUTA PRINCIPAL
      ====================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ======================================================
          RUTA NO ENCONTRADA
      ====================================================== */}

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


// ============================================================
// APLICACIÓN PRINCIPAL
// ============================================================

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