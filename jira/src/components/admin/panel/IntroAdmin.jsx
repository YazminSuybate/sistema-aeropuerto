export default function IntroAdmin() {
  return (
    <div className="admin-panel-content p-8">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
        Bienvenido al Panel Admin
      </h2>
      <p className="text-gray-700">
        Desde aquí puedes gestionar usuarios, asignar tareas, definir tiempos máximos y monitorear los tickets de forma centralizada.
      </p>
    </div>
  )
}
