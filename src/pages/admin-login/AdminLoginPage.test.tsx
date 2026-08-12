import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { AdminLoginPage } from './AdminLoginPage';
import { AuthProvider } from '../../context/AuthContext';
import * as authApi from '../../api/auth/auth.api';

vi.spyOn(authApi, 'login').mockResolvedValue({
  user: { id: '1', email: 'admin@tunisiaoggi.com', username: 'admin', role: 'SUPER_ADMIN' },
  csrfToken: 'csrf-123',
});
vi.spyOn(authApi, 'fetchCurrentUser').mockRejectedValue(new Error('not authenticated'));

function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminLoginPage', () => {
  it('submits email and password and calls the login API', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('Email Address'), 'admin@tunisiaoggi.com');
    await user.type(screen.getByLabelText('Password'), 'ChangeMe123!');
    await user.click(screen.getByRole('button', { name: /secure login/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('admin@tunisiaoggi.com', 'ChangeMe123!');
    });
  });

  it('renders a "Continue with Google" link pointing to the backend OAuth endpoint', () => {
    renderLoginPage();
    const link = screen.getByRole('link', { name: /continue with google/i });
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    expect(link).toHaveAttribute('href', `${apiUrl}/auth/google`);
  });

  it('renders the brand heading and security notice', () => {
    renderLoginPage();
    expect(screen.getByText('Tunisia Oggi')).toBeInTheDocument();
    expect(screen.getByText('256-bit Encrypted Management Gateway')).toBeInTheDocument();
  });
});
