import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../servicios/api";

const METODOS = ["Efectivo", "Transferencia", "Tarjeta", "Depósito"];

const FORM_VACIO = {
  nombre: "", telefono: "", direccion: "",
  fecha_solicitud: "", fecha_envio: "",
  total: "", pagado: [], comentario: ""
};

const s = {
  page: {
    minHeight: "calc(100vh - 58px)",
    background: "var(--color-bg)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "3rem 1.5rem",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "16px",
    padding: "2.5rem",
  },
  label: { display: "block", marginBottom: "0.5rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  divider: { height: "1px", background: "var(--color-border)", margin: "0.5rem 0" },
  checkLabel: (checked) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: checked ? "rgba(201,168,76,0.07)" : "var(--color-surface2)",
    border: `1px solid ${checked ? "rgba(201,168,76,0.25)" : "var(--color-border)"}`,
    borderRadius: "8px",
    padding: "0.6rem 0.9rem",
    cursor: "pointer",
    transition: "all 0.15s",
    fontSize: "0.88rem",
    color: checked ? "var(--color-accent)" : "var(--color-text)",
    fontFamily: "'DM Sans', sans-serif",
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: 500,
  }),
  btnPrimary: {
    flex: 1,
    padding: "0.85rem",
    background: "var(--color-accent)",
    color: "#0f0e0c",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "opacity 0.15s",
    letterSpacing: "0.02em",
  },
  btnGhost: {
    flex: 1,
    padding: "0.85rem",
    background: "transparent",
    color: "var(--color-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

function PedidoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [form, setForm] = useState(FORM_VACIO);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  useEffect(() => {
    if (!esEdicion) return;
    const cargar = async () => {
      try {
        const { data } = await API.get(`/pedidos/${id}`);
        setForm({
          ...data,
          fecha_solicitud: data.fecha_solicitud?.slice(0, 10) || "",
          fecha_envio: data.fecha_envio?.slice(0, 10) || "",
        });
      } catch {
        alert("No se pudo cargar el pedido.");
        navigate("/pedidos");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, esEdicion, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePagadoChange = (e) => {
    const { value, checked } = e.target;
    setForm({
      ...form,
      pagado: checked ? [...form.pagado, value] : form.pagado.filter((m) => m !== value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, total: parseFloat(form.total) };
      if (esEdicion) {
        await API.patch(`/pedidos/${id}`, body);
        navigate(`/pedidos/${id}`);
      } else {
        await API.post("/pedidos", body);
        navigate("/pedidos");
      }
    } catch {
      alert("Error al guardar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ ...s.page, alignItems: "center" }}>
        <div style={s.card}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1,2,3,4].map(i => <div key={i} className="loading-bar" style={{ height: "42px" }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card} className="fade-up">

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-text)" }}>
              {esEdicion ? "Editar pedido" : "Nuevo pedido"}
            </h2>
            <button
              type="button"
              onClick={() => navigate(esEdicion ? `/pedidos/${id}` : "/pedidos")}
              style={{ background: "none", border: "none", color: "var(--color-muted)", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Volver
            </button>
          </div>
          <div style={{ width: "32px", height: "2px", background: "var(--color-accent)", borderRadius: "1px" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Juan García" />
            </div>
            <div>
              <label style={s.label}>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} required maxLength="10" placeholder="4181234567" />
            </div>
          </div>

          <div>
            <label style={s.label}>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Calle, Colonia, Ciudad" />
          </div>

          <div style={s.divider} />

          <div>
            <label style={{ ...s.label, display: "block", marginBottom: "0.8rem" }}>Métodos de pago</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {METODOS.map((metodo) => (
                <label key={metodo} style={s.checkLabel(form.pagado.includes(metodo))}>
                  <input
                    type="checkbox"
                    value={metodo}
                    checked={form.pagado.includes(metodo)}
                    onChange={handlePagadoChange}
                  />
                  {metodo}
                </label>
              ))}
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Fecha de solicitud</label>
              <input type="date" name="fecha_solicitud" value={form.fecha_solicitud} onChange={handleChange} required />
            </div>
            <div>
              <label style={s.label}>Fecha de envío</label>
              <input type="date" name="fecha_envio" value={form.fecha_envio} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label style={s.label}>Total (MXN)</label>
            <input type="number" name="total" value={form.total} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" />
          </div>

          <div>
            <label style={s.label}>Comentario</label>
            <textarea name="comentario" value={form.comentario} onChange={handleChange} rows="3" placeholder="Notas adicionales..." style={{ resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              style={s.btnGhost}
              onClick={() => navigate(esEdicion ? `/pedidos/${id}` : "/pedidos")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Guardando..." : esEdicion ? "Actualizar pedido" : "Guardar pedido"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PedidoForm;