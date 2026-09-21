import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'bitacora-entries'
const OBJETIVOS = ['Frontend', 'DSA', 'Inglés', 'Cierre']

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [entries, setEntries] = useState(loadEntries)
  const [fecha, setFecha] = useState('')
  const [horas, setHoras] = useState('')
  const [objetivo, setObjetivo] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function handleSubmit(event) {
    event.preventDefault()
    const horasNum = Number(horas)
    if (!fecha || !objetivo || Number.isNaN(horasNum) || horasNum <= 0) {
      return
    }

    const nueva = {
      id: crypto.randomUUID(),
      fecha,
      horas: horasNum,
      objetivo,
    }

    setEntries((prev) => [nueva, ...prev])
    setFecha('')
    setHoras('')
    setObjetivo('')
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <main className="bitacora">
      <h1>Bitácora</h1>
      <p className="bitacora-intro">Registra fecha, horas y objetivo de estudio.</p>

      <form className="bitacora-form" onSubmit={handleSubmit}>
        <label>
          Fecha
          <input
            type="date"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>

        <label>
          Horas
          <input
            type="number"
            name="horas"
            min="0.25"
            step="0.25"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            required
          />
        </label>

        <label>
          Objetivo
          <select
            name="objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            required
          >
            <option value="">Selecciona un objetivo</option>
            {OBJETIVOS.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Agregar</button>
      </form>

      <section className="bitacora-lista" aria-live="polite">
        <h2>Registros</h2>
        {entries.length === 0 ? (
          <p className="bitacora-vacio">Aún no hay registros.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <span>{entry.fecha}</span>
                <span>
                  {entry.horas} {entry.horas === 1 ? 'hora' : 'horas'}
                </span>
                <span>{entry.objetivo}</span>
                <button
                  type="button"
                  className="bitacora-eliminar"
                  onClick={() => handleDelete(entry.id)}
                  aria-label={`Eliminar registro del ${entry.fecha}, ${entry.objetivo}`}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
