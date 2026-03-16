import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../servicios/api";

const METODOS = ["Efectivo", "Transferencia", "Tarjeta", "Depósito"];

const s = {
  page: {
    minHeight: "calc(100vh - 58px)",
    background: "var(--color-bg)",
    padding: "2.5rem 2rem",
  },
  container: { maxWidth: "1000px", margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--color-text)",
    lineHeight: 1,
  },
  subtitle: {
    color: "var(--color-muted)",
    fontSize: "0.82rem",
    marginTop: "0.4rem",
    fontFamily: "'DM Mono', monospace",
  },
  btnPrimary: {
    background: "var(--color-accent)",
    color: "#0f0e0c",
    border: "none",
    borderRadius: "8px",
    padding: "0.65rem 1.3rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "opacity 0.15s",
  },
  filters: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.2rem",
    flexWrap: "wrap",
  },
  filterInput: { flex: 1, minWidth: "200px" },
  btnGhost: {
    background: "transparent",
    border: "1px solid var(--color-border)",
    color: "var(--color-muted)",
    borderRadius: "6px",
    padding: "0.6rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  table: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    overflow: "hidden",
    width: "100%",
  },
  thead: {
    background: "var(--color-surface2)",
    borderBottom: "1px solid var(--color-border)",
  },
  th: {
    padding: "0.85rem 1.2rem",
    textAlign: "left",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-muted)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "1rem 1.2rem",
    fontSize: "0.88rem",
    color: "var(--color-text)",
    borderBottom: "1px solid var(--color-border)",
  },
  tag: {
    display: "inline-block",
    background: "rgba(201,168,76,0.12)",
    color: "var(--color-accent)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginRight: "4px",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "var(--color-muted)",
  },
};

function PedidosList() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPagado, setFiltroPagado] = useState("");

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const params = {};
      

      if (busqueda) {
        params.nombre = busqueda;
      }
      
      if (filtroPagado) {
        params.pagado = filtroPagado;
      }
      
      const { data } = await API.get("/pedidos", { params });
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarPedidos(); 
  }, [busqueda, filtroPagado]);

  const handleEliminar = async (e, pedido) => {
    e.stopPropagation();
    if (!window.confirm(`¿Eliminar pedido de ${pedido.nombre}?`)) return;
    try {
      await API.delete(`/pedidos/${pedido._id}`);
      cargarPedidos();
    } catch {
      alert("Error al eliminar el pedido.");
    }
  };

  const formatFecha = (str) => {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDinero = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  const total = pedidos.reduce((s, p) => s + (p.total || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.container} className="fade-up">

        <div style={s.header}>
          <div>
            <h2 style={s.title}>Pedidos</h2>
            <p style={s.subtitle}>
              {pedidos.length} registros &nbsp;·&nbsp; Total {formatDinero(total)}
            </p>
          </div>
          <button
            style={s.btnPrimary}
            onClick={() => navigate("/pedidos/nuevo")}
            onMouseEnter={(e) => e.target.style.opacity = "0.85"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            + Nuevo pedido
          </button>
        </div>

        {/* Filtros - CORREGIDO */}
        <div style={s.filters}>
          <div style={s.filterInput}>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}


              
              onChange={(e) => { 
                setBusqueda(e.target.value); 
                setFiltroPagado(""); 
              }}
            />
          </div>
          <select
            value={filtroPagado}
            onChange={(e) => { 
              setFiltroPagado(e.target.value); 
              setBusqueda(""); 
            }}
            style={{ width: "auto", minWidth: "180px" }}
          >
            <option value="">Todos los métodos</option>
            {METODOS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button style={s.btnGhost} onClick={cargarPedidos}>
            Actualizar
          </button>
        </div>

        {/* Tabla */}
        <div style={s.table}>
          {loading ? (
            <div style={s.empty}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", padding: "2rem" }}>
                {[1,2,3].map(i => (
                  <div key={i} className="loading-bar" style={{ height: "44px" }} />
                ))}
              </div>
            </div>
          ) : pedidos.length === 0 ? (
            <div style={s.empty}>
              <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>No hay pedidos registrados.</p>
              <button style={s.btnPrimary} onClick={() => navigate("/pedidos/nuevo")}>
                Crear primer pedido
              </button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={s.thead}>
                <tr>
                  {["Nombre", "Teléfono", "Fecha envío", "Total", "Abono", "Pago", ""].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr
                    key={p._id}
                    onClick={() => navigate(`/pedidos/${p._id}`)}
                    style={{ cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...s.td, fontWeight: 600, borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {p.nombre}
                    </td>
                    <td style={{ ...s.td, fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "var(--color-muted)", borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {p.telefono}
                    </td>
                    <td style={{ ...s.td, color: "var(--color-muted)", borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {formatFecha(p.fecha_envio)}
                    </td>
                    <td style={{ ...s.td, color: "var(--color-accent)", fontWeight: 700, fontFamily: "'DM Mono', monospace", borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {formatDinero(p.total)}
                    </td>
                    <td style={{ ...s.td, color: "var(--color-muted)", fontFamily: "'DM Mono', monospace", borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {p.abono ? formatDinero(p.abono) : "—"}
                    </td>
                    <td style={{ ...s.td, borderBottom: i === pedidos.length - 1 ? "none" : undefined }}>
                      {(p.pagado || []).map((m) => <span key={m} style={s.tag}>{m}</span>)}
                    </td>
                    <td style={{ ...s.td, borderBottom: i === pedidos.length - 1 ? "none" : undefined }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: "flex", gap: "0.8rem" }}>
                        <button
                          onClick={() => navigate(`/pedidos/${p._id}/editar`)}
                          style={{ background: "none", border: "none", color: "var(--color-accent)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => handleEliminar(e, p)}
                          style={{ background: "none", border: "none", color: "var(--color-muted)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                          onMouseEnter={(e) => e.target.style.color = "#e57373"}
                          onMouseLeave={(e) => e.target.style.color = "var(--color-muted)"}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default PedidosList;