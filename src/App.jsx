import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import LoginForm from './componentes/LoginForm'
import PedidoForm from './componentes/PedidoForm'
import PedidosList from './componentes/PedidoList'
import PedidoDetalle from './componentes/PedidoDetalle'

function RutaProtegida({ children }) {
  const token = sessionStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "58px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/pedidos')}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}
      >
        <div style={{
          width: "28px",
          height: "28px",
          background: "var(--color-accent)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "12px",
            height: "2px",
            background: "#0f0e0c",
            boxShadow: "0 4px 0 #0f0e0c, 0 8px 0 #0f0e0c",
          }} />
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "var(--color-text)",
          letterSpacing: "0.01em",
        }}>
          Baggete
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {[
          { path: "/pedidos", label: "Pedidos" },
          { path: "/pedidos/nuevo", label: "Nuevo pedido" },
        ].map(({ path, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: isActive(path) ? "var(--color-surface2)" : "transparent",
              border: isActive(path) ? "1px solid var(--color-border)" : "1px solid transparent",
              color: isActive(path) ? "var(--color-text)" : "var(--color-muted)",
              padding: "0.4rem 0.9rem",
              borderRadius: "6px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!isActive(path)) e.target.style.color = "var(--color-text)"
            }}
            onMouseLeave={(e) => {
              if (!isActive(path)) e.target.style.color = "var(--color-muted)"
            }}
          >
            {label}
          </button>
        ))}

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", background: "var(--color-border)", margin: "0 0.5rem" }} />

        {/* Usuario */}
        <span style={{
          fontSize: "0.8rem",
          color: "var(--color-muted)",
          fontFamily: "'DM Mono', monospace",
        }}>
          {sessionStorage.getItem('username')}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
            padding: "0.4rem 0.9rem",
            borderRadius: "6px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#c0392b"
            e.target.style.color = "#e57373"
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "var(--color-border)"
            e.target.style.color = "var(--color-muted)"
          }}
        >
          Salir
        </button>
      </div>
    </nav>
  )
}

function LayoutProtegido({ children }) {
  return (
    <RutaProtegida>
      <NavBar />
      {children}
    </RutaProtegida>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          sessionStorage.getItem('token')
            ? <Navigate to="/pedidos" replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/pedidos" element={<LayoutProtegido><PedidosList /></LayoutProtegido>} />
      <Route path="/pedidos/nuevo" element={<LayoutProtegido><PedidoForm /></LayoutProtegido>} />
      <Route path="/pedidos/:id" element={<LayoutProtegido><PedidoDetalle /></LayoutProtegido>} />
      <Route path="/pedidos/:id/editar" element={<LayoutProtegido><PedidoForm /></LayoutProtegido>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App