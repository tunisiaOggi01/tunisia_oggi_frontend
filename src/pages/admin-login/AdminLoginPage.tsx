import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Split-screen admin login: email/password form (functional) plus an inert "Continue with Google" button. */
export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/articles');
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-2">
      <div className="hidden bg-gray-200 md:block" aria-hidden="true" />
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl font-bold text-brand">TUNISIA OGGI</h1>
          <p className="mt-1 text-xs uppercase text-gray-500">Administrative Access</p>

          <button
            type="button"
            disabled
            title="Google sign-in is not available yet"
            className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded border border-gray-300 py-2 text-sm opacity-60"
          >
            Continue with Google
          </button>

          <p className="my-4 text-center text-xs uppercase text-gray-400">Or email access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="w-full rounded bg-brand py-2 text-white">
              Secure Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
