import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

type LoginPageProps = {
  onLoginSuccess: () => void
}

const VALID_USERNAME = 'Lorenzo'
const VALID_PASSWORD = 'Bocca'

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Controllo centralizzato delle credenziali prima della navigazione.
    const isValidUser = username === VALID_USERNAME && password === VALID_PASSWORD

    if (!isValidUser) {
      setError('Credenziali non valide. Riprova.')
      return
    }

    setError('')
    onLoginSuccess()
    navigate('/onboarding')
  }

  return (
    <section className="auth-panel" aria-label="Accesso BriefAI">
      <p className="eyebrow">BriefAI</p>
      <h1>Accedi</h1>
      <p className="subtitle">Inserisci le tue credenziali per iniziare la configurazione.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Utente</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Lorenzo"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Bocca"
          autoComplete="current-password"
          required
        />

        <p className="top-link-row">
            <a className="text-link" href="#" aria-label="Recupera password">
          Ti sei dimenticato la password?
        </a>
      </p>
        
        <button type="submit">Entra</button>

        {error && (
          <p className="error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </form>

      <p className="auth-footer">
        Non hai un account? <Link className="text-link" to="/register">Registrati</Link>
      </p>

      <p className="auth-footer">
        Vuoi tornare alla pagina iniziale? <Link className="text-link" to="/">Home</Link>
      </p>
    </section>
  )
}

export default LoginPage
