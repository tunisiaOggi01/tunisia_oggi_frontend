import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AdminLoginPage } from './AdminLoginPage';
import { AuthProvider } from '../../context/AuthContext';
import * as authApi from '../../api/auth/auth.api';

vi.spyOn(authApi, 'login').mockResolvedValue({
  user: { id: '1', email: 'admin@tunisiaoggi.com', username: 'admin', role: 'SUPER_ADMIN' },
  csrfToken: 'csrf-123',
});
vi.spyOn(authApi, 'fetchCurrentUser').mockRejectedValue(new Error('not authenticated'));

describe('AdminLoginPage', () => {
  it('submits email and password and calls the login API', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email Address'), 'admin@tunisiaoggi.com');
    await user.type(screen.getByLabelText('Password'), 'ChangeMe123!');
    await user.click(screen.getByRole('button', { name: /secure login/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('admin@tunisiaoggi.com', 'ChangeMe123!');
    });
  });

  it('renders a disabled "Continue with Google" button', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeDisabled();
  });
});
