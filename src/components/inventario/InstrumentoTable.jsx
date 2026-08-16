import {
  Edit,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react";

function InstrumentoTable({
  instrumentos,
  onEditar,
  onEliminar,
  onVer,
}) {
  if (instrumentos.length === 0) {
    return (
      <div className="empty-inventory">

        <div className="empty-icon">
          🎺
        </div>

        <h3>
          No hay instrumentos
        </h3>

        <p>
          Todavía no has registrado instrumentos
          en el inventario.
        </p>

      </div>
    );
  }

  return (
    <div className="table-container">

      <table className="inventory-table">

        <thead>
          <tr>
            <th>Código</th>
            <th>Instrumento</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Estado</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {instrumentos.map((instrumento) => (

            <tr key={instrumento.id}>

              <td>
                <strong className="instrument-code">
                  {instrumento.codigo}
                </strong>
              </td>

              <td>
                <div className="instrument-name">
                  <div className="instrument-table-icon">
                    {instrumento.tipo === "Percusión"
                      ? "🥁"
                      : "🎺"}
                  </div>

                  <div>
                    <strong>
                      {instrumento.nombre}
                    </strong>

                    {instrumento.modelo && (
                      <span>
                        {instrumento.modelo}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td>
                {instrumento.tipo}
              </td>

              <td>
                {instrumento.marca || "—"}
              </td>

              <td>
                <span
                  className={`inventory-status ${instrumento.estado
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {instrumento.estado}
                </span>
              </td>

              <td>
                {instrumento.ubicacion || "—"}
              </td>

              <td>

                <div className="table-actions">

                  <button
                    title="Ver"
                    onClick={() =>
                      onVer(instrumento)
                    }
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    title="Editar"
                    onClick={() =>
                      onEditar(instrumento)
                    }
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    title="Eliminar"
                    className="delete-action"
                    onClick={() =>
                      onEliminar(instrumento)
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default InstrumentoTable;