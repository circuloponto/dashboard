import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../img/Logo Bon-dja_redondo.png'

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Password from environment variable, fallback to default
  // Set VITE_LOGIN_PASSWORD in .env.local or Vercel environment variables
  const CORRECT_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD || 'ines2024'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true')
      setIsAuthenticated(true)
      navigate('/dashboard')
    } else {
      setError('Senha incorreta. Por favor, tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <img
              src={logo}
              alt="Logo Bon-dja"
              className="mx-auto w-24 h-24 rounded-full object-cover mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard de Doações
            </h1>
            <p className="text-gray-600">
              Faça login para acessar o painel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

