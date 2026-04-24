import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validazione esplicita: se i termini non sono accettati, blocca l'invio.
    if (!acceptedTerms) {
      setError('Devi accettare i Termini di servizio e l\'Informativa sulla privacy.')
      return
    }

    // Flusso demo: non salviamo ancora l'utente, riportiamo solo alla login.
    setError('')
    setUsername('')
    setEmail('')
    setNewPassword('')
    setAcceptedTerms(false)
    navigate('/login')
  }

  return (
    <section className="auth-panel" aria-label="Registrazione BriefAI">
      <p className="eyebrow">BriefAI</p>
      <h1>Registrati</h1>
      <p className="subtitle">Crea il tuo account per iniziare.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="register-username">Utente</label>
        <input
          id="register-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Il tuo username"
          autoComplete="username"
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nome@email.com"
          autoComplete="email"
          required
        />

        <label htmlFor="register-password">Nuova password</label>
        <input
          id="register-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Nuova password"
          autoComplete="new-password"
          required
        />

        <label className="checkbox-row" htmlFor="register-terms">
          <input
            id="register-terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
          />
          <span>Accetto i Termini di servizio e l'Informativa sulla privacy</span>
        </label>

        <button type="submit">Crea account</button>

        {error && (
          <p className="error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </form>

      <p className="auth-footer">
        Se hai gia un account fai <Link className="text-link" to="/login">accesso</Link>
      </p>

      <p className="auth-footer">
        Torna alla <Link className="text-link" to="/">home</Link>
      </p>
    </section>
  )
}

export default RegisterPage
