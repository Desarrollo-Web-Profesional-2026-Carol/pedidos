import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../servicios/api";

const s = {
  page: {
    minHeight: "calc(100vh - 58px)",
    background: "var(--color-bg)",
    padding: "3rem 1.5rem",
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: "680px" },
  card: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    padding: "1.8rem",
    marginBottom: "1rem",
  },
  fieldLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-muted)",
    marginBottom: "0.35rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  fieldValue: {
    fontSize: "0.95rem",
    color: "var(--color-text)",
    fontWeight: 500,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  tag: {
    display: "inline-block",
    background: "rgba(201,168,76,0.12)",
    color: "var(--color-accent)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "4px",
    padding: "3px 9px",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginRight: "5px",
  },
  btnPrimary: {
    padding: "0.6rem 1.2rem",
    background: "var(--color-accent)",
    color: "#0f0e0c",
    border: "none",
    borderRadius: "7px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "0.83rem",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  btnGhost: {
    padding: "0.6rem 1.2rem",
    background: "transparent",
    color: "var(--color-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "7px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.83rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnDanger: {
    padding: "0.6rem 1.2rem",
    background: "rgba(192,57,43,0.1)",
    color: "#e57373",
    border: "1px solid rgba(192,57,43,0.25)",
    borderRadius: "7px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.83rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

function Campo({ label, valor, mono }) {
  return (
    <div>
      <p style={s.fieldLabel}>{label}</p>
      <p style={{ ...s.fieldValue, fontFamily: mono ? "'DM Mono', monospace" : undefined, fontSize: mono ? "0.82rem" : undefined }}>
        {valor || "—"}
      </p>
    </div>
  );
}

function PedidoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await API.get(`/pedidos/${id}`);
        setPedido(data);
      } catch {
        alert("No se encontró el pedido.");
        navigate("/pedidos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, navigate]);

  const handleEliminar = async () => {
    if (!window.confirm(`¿Eliminar pedido de ${pedido.nombre}?`)) return;
    try {
      await API.delete(`/pedidos/${id}`);
      navigate("/pedidos");
    } catch {
      alert("Error al eliminar el pedido.");
    }
  };

  const formatFecha = (str) => {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatDinero = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.card}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1,2,3].map(i => <div key={i} className="loading-bar" style={{ height: "40px" }} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) return null;

  const saldoPendiente = (pedido.total || 0) - (pedido.abono || 0);

  return (
    <div style={s.page}>
      <div style={s.container} className="fade-up">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <button
              onClick={() => navigate("/pedidos")}
              style={{ ...s.btnGhost, marginBottom: "0.8rem", fontSize: "0.78rem" }}
            >
              ← Volver a pedidos
            </button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>
              {pedido.nombre}
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--color-muted)", marginTop: "0.3rem" }}>
              ID: {pedido._id}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button style={s.btnPrimary} onClick={() => navigate(`/pedidos/${id}/editar`)}>
              Editar
            </button>
            <button style={s.btnDanger} onClick={handleEliminar}>
              Eliminar
            </button>
          </div>
        </div>

        {/* Total destacado */}
        <div style={{ ...s.card, borderColor: "rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p style={s.fieldLabel}>Total del pedido</p>
            {pedido.abono > 0 && (
              <p style={s.fieldLabel}>Saldo pendiente</p>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--color-accent)" }}>
              {formatDinero(pedido.total)}
            </p>
            {pedido.abono > 0 && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.2rem", color: saldoPendiente > 0 ? "#e57373" : "var(--color-muted)" }}>
                {formatDinero(saldoPendiente)}
              </p>
            )}
          </div>
          {(pedido.pagado || []).length > 0 && (
            <div style={{ marginTop: "0.8rem" }}>
              {pedido.pagado.map((m) => <span key={m} style={s.tag}>{m}</span>)}
            </div>
          )}
        </div>

        {/* Datos principales */}
        <div style={s.card}>
          <div style={s.grid2}>
            <Campo label="Teléfono" valor={pedido.telefono} mono />
            <Campo label="Fecha de solicitud" valor={formatFecha(pedido.fecha_solicitud)} />
            <Campo label="Fecha de envío" valor={formatFecha(pedido.fecha_envio)} />
            {pedido.abono > 0 && (
              <Campo label="Abono" valor={formatDinero(pedido.abono)} mono />
            )}
          </div>
        </div>

        {/* Comentario */}
        {pedido.comentario && (
          <div style={s.card}>
            <p style={s.fieldLabel}>Comentario</p>
            <p style={{ ...s.fieldValue, color: "var(--color-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>
              {pedido.comentario}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--color-muted)", textAlign: "center", marginTop: "0.5rem" }}>
          Creado {formatFecha(pedido.createdAt)} &nbsp;·&nbsp; Actualizado {formatFecha(pedido.updatedAt)}
        </p>

      </div>
    </div>
  );
}

export default PedidoDetalle;