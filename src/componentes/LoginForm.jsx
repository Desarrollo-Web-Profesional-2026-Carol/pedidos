import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../servicios/api";

// Icono del ojo (SVG)
const EyeIcon = ({ visible }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.7 }}
  >
    {visible ? (
      // Ojo abierto
      <path 
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    ) : (
      // Ojo cerrado
      <path 
        d="M2 2L22 22M6.71277 6.72237C4.40676 8.21422 2.5 11.3333 2.5 11.3333C2.5 11.3333 5.5 19.1667 12 19.1667C14.2713 19.1667 16.2304 18.3953 17.8187 17.035M9.87868 9.87868C9.33579 10.4216 9 11.1716 9 12C9 13.6569 10.3431 15 12 15C12.8284 15 13.5784 14.6642 14.1213 14.1213M14.8284 9.17157C14.0771 8.46073 13.0604 8 11.9347 8C9.96769 8 8.37031 9.52739 8.07077 11.4169M17.5 6.5L20 4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    )}
    <circle 
      cx="12" 
      cy="12" 
      r="3" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill={visible ? "currentColor" : "none"}
    />
  </svg>
);

function LoginForm() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (modo === "signup") {
        await API.post("/usuario/signup", form);
        setModo("login");
        setError("success:Cuenta creada. Ahora inicia sesión.");
        setForm({ username: "", password: "" }); // Limpiar formulario
      } else {
        const { data } = await API.post("/usuario/login", form);
        
        // Guardar token según preferencia
        if (recordar) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", form.username);
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("username", form.username);
        }
        
        navigate("/pedidos");
      }
    } catch (err) {
      setError(
        modo === "login"
          ? "Usuario o contraseña incorrectos."
          : err.response?.data?.error || "Error al crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  const esSuccess = error.startsWith("success:");
  const mensajeError = esSuccess ? error.replace("success:", "") : error;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="fade-up" style={{
        width: "100%",
        maxWidth: "420px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "16px",
        padding: "2.5rem",
        position: "relative",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            width: "36px",
            height: "3px",
            background: "var(--color-accent)",
            borderRadius: "2px",
            marginBottom: "1.2rem",
          }} />
          <h1 style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            color: "var(--color-text)",
            lineHeight: 1.2,
            marginBottom: "0.4rem",
          }}>
            Baggete
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Sistema de gestión de pedidos
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "var(--color-surface2)",
          borderRadius: "8px",
          padding: "3px",
          marginBottom: "1.8rem",
          border: "1px solid var(--color-border)",
        }}>
          {[
            { id: "login", label: "Iniciar sesión" },
            { id: "signup", label: "Registrarse" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { 
                setModo(m.id); 
                setError("");
                setForm({ username: "", password: "" });
                setMostrarPassword(false);
              }}
              style={{
                flex: 1,
                padding: "0.55rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.83rem",
                fontWeight: 600,
                transition: "all 0.2s",
                background: modo === m.id ? "var(--color-accent)" : "transparent",
                color: modo === m.id ? "#0f0e0c" : "var(--color-muted)",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.2rem",
            fontSize: "0.83rem",
            background: esSuccess ? "rgba(39,174,96,0.08)" : "rgba(192,57,43,0.08)",
            border: `1px solid ${esSuccess ? "rgba(39,174,96,0.3)" : "rgba(192,57,43,0.3)"}`,
            color: esSuccess ? "#27ae60" : "#e57373",
          }}>
            {mensajeError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}>
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="ej: juan_perez"
              autoComplete={modo === "login" ? "username" : "off"}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                autoComplete={modo === "login" ? "current-password" : "new-password"}
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                }}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-muted)",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.color = "var(--color-accent)"}
                onMouseLeave={(e) => e.target.style.color = "var(--color-muted)"}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <EyeIcon visible={mostrarPassword} />
              </button>
            </div>
          </div>

          {/* Opciones adicionales solo para login */}
          {modo === "login" && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "0.25rem",
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "var(--color-muted)",
              }}>
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                Recordar sesión
              </label>
              
              <button
                type="button"
                onClick={() => alert("Funcionalidad de recuperación de contraseña")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-accent)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {/* Requisitos de contraseña para registro */}
          {modo === "signup" && form.password && (
            <div style={{
              fontSize: "0.75rem",
              color: form.password.length >= 6 ? "#27ae60" : "#e57373",
              marginTop: "-0.5rem",
              paddingLeft: "0.25rem",
            }}>
              {form.password.length >= 6 ? "✓" : "•"} Mínimo 6 caracteres
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (modo === "signup" && form.password.length < 6)}
            style={{
              marginTop: "1rem",
              padding: "0.85rem",
              background: loading || (modo === "signup" && form.password.length < 6) 
                ? "var(--color-border)" 
                : "var(--color-accent)",
              color: loading || (modo === "signup" && form.password.length < 6) 
                ? "var(--color-muted)" 
                : "#0f0e0c",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading || (modo === "signup" && form.password.length < 6) 
                ? "not-allowed" 
                : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.03em",
            }}
          >
            {loading ? "Cargando..." : modo === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginForm;