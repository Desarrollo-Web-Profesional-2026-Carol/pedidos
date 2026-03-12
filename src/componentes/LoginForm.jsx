import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../servicios/api";

function LoginForm() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      } else {
        const { data } = await API.post("/usuario/login", form);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("username", form.username);
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
              onClick={() => { setModo(m.id); setError(""); }}
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
            color: esSuccess ? "var(--color-success)" : "#e57373",
          }}>
            {mensajeError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="tu_usuario"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              padding: "0.85rem",
              background: loading ? "var(--color-border)" : "var(--color-accent)",
              color: loading ? "var(--color-muted)" : "#0f0e0c",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
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