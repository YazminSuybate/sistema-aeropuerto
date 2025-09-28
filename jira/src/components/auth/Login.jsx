export default function Login() {
  return (
    <div className="form-content">
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
        Iniciar Sesión
      </h2>
      <form className="flex flex-col gap-4">
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
          Entrar
        </button>
      </form>
    </div>
  )
}
