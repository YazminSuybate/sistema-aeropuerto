export default function Register() {
  return (
    <div className="form-content">
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
        Registrarse
      </h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          className="input-field"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field"
        />
        <button type="submit" className="btn-login">
          Crear cuenta
        </button>
      </form>
    </div>
  )
}
