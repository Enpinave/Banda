import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const formularioInicial = {
  codigo: "",
  nombre: "",
  tipo: "",
  marca: "",
  modelo: "",
  serial: "",
  estado: "Disponible",
  fechaAdquisicion: "",
  valor: "",
  ubicacion: "Bodega de instrumentos",
  observaciones: "",
};

function InstrumentoForm({ instrumento, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (instrumento) {
      setFormulario(instrumento);
    } else {
      setFormulario(formularioInicial);
    }
  }, [instrumento]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formulario.codigo.trim() ||
      !formulario.nombre.trim() ||
      !formulario.tipo.trim()
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    onGuardar({
      ...formulario,
      valor: formulario.valor
        ? Number(formulario.valor)
        : 0,
    });
  };

  return (
    <div className="modal-overlay">

      <div className="instrument-modal">

        <div className="modal-header">

          <div>
            <span className="modal-label">
              INVENTARIO
            </span>

            <h2>
              {instrumento
                ? "Editar instrumento"
                : "Nuevo instrumento"}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onCancelar}
          >
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="instrument-form"
        >

          <div className="form-section-title">
            Información básica
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>
                Código *
              </label>

              <input
                name="codigo"
                value={formulario.codigo}
                onChange={handleChange}
                placeholder="Ej: TR-001"
              />
            </div>

            <div className="form-field">
              <label>
                Nombre *
              </label>

              <input
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Ej: Trompeta"
              />
            </div>

            <div className="form-field">
              <label>
                Tipo *
              </label>

              <select
                name="tipo"
                value={formulario.tipo}
                onChange={handleChange}
              >
                <option value="">
                  Seleccionar
                </option>

                <option value="Viento metal">
                  Viento metal
                </option>

                <option value="Viento madera">
                  Viento madera
                </option>

                <option value="Percusión">
                  Percusión
                </option>

                <option value="Cuerda">
                  Cuerda
                </option>

                <option value="Otro">
                  Otro
                </option>
              </select>
            </div>

            <div className="form-field">
              <label>
                Marca
              </label>

              <input
                name="marca"
                value={formulario.marca}
                onChange={handleChange}
                placeholder="Ej: Yamaha"
              />
            </div>

            <div className="form-field">
              <label>
                Modelo
              </label>

              <input
                name="modelo"
                value={formulario.modelo}
                onChange={handleChange}
                placeholder="Modelo"
              />
            </div>

            <div className="form-field">
              <label>
                Número de serie
              </label>

              <input
                name="serial"
                value={formulario.serial}
                onChange={handleChange}
                placeholder="Número de serie"
              />
            </div>

          </div>

          <div className="form-section-title">
            Estado y ubicación
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>
                Estado
              </label>

              <select
                name="estado"
                value={formulario.estado}
                onChange={handleChange}
              >
                <option value="Disponible">
                  Disponible
                </option>

                <option value="Prestado">
                  Prestado
                </option>

                <option value="Mantenimiento">
                  Mantenimiento
                </option>

                <option value="Dañado">
                  Dañado
                </option>

                <option value="Baja">
                  Baja
                </option>
              </select>
            </div>

            <div className="form-field">
              <label>
                Fecha de adquisición
              </label>

              <input
                type="date"
                name="fechaAdquisicion"
                value={formulario.fechaAdquisicion}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>
                Valor
              </label>

              <input
                type="number"
                name="valor"
                min="0"
                value={formulario.valor}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-field">
              <label>
                Ubicación
              </label>

              <input
                name="ubicacion"
                value={formulario.ubicacion}
                onChange={handleChange}
                placeholder="Ubicación"
              />
            </div>

          </div>

          <div className="form-section-title">
            Observaciones
          </div>

          <div className="form-field">

            <textarea
              name="observaciones"
              value={formulario.observaciones}
              onChange={handleChange}
              rows="4"
              placeholder="Escribe observaciones sobre el instrumento..."
            />

          </div>

          <div className="modal-actions">

            <button
              type="button"
              className="button-secondary"
              onClick={onCancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button-primary"
            >
              <Save size={18} />

              {instrumento
                ? "Guardar cambios"
                : "Registrar instrumento"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default InstrumentoForm;