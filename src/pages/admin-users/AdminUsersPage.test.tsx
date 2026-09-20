import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminUsersPage } from './AdminUsersPage';

vi.mock('../../hooks/users/useUsers', () => ({
  useUsers: () => ({
    data: [
      {
        id: '1',
        email: 'admin@test.com',
        username: 'admin',
        role: 'SUPER_ADMIN',
        imageUrl: null,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        email: 'editor@test.com',
        username: 'editor',
        role: 'EDITOR',
        imageUrl: null,
        createdAt: '2024-02-01T00:00:00Z',
      },
    ],
  }),
}));

vi.mock('../../hooks/users/useUserMutations', () => ({
  useUserMutations: () => ({
    updateUserRole: { mutate: vi.fn() },
    deleteUser: { mutate: vi.fn() },
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../components/admin/AdminSidebar', () => ({
  AdminSidebar: () => <aside data-testid="admin-sidebar" />,
}));

describe('AdminUsersPage', () => {
  it('renders the users table with headers', () => {
    render(<AdminUsersPage />);
    expect(screen.getByText('admin.users.pageTitle')).toBeInTheDocument();
    expect(screen.getByText('admin.users.colUsername')).toBeInTheDocument();
    expect(screen.getByText('admin.users.colEmail')).toBeInTheDocument();
    expect(screen.getByText('admin.users.colRole')).toBeInTheDocument();
  });

  it('renders a row for each user', () => {
    render(<AdminUsersPage />);
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('editor')).toBeInTheDocument();
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    expect(screen.getByText('editor@test.com')).toBeInTheDocument();
  });

  it('displays role select dropdowns', () => {
    render(<AdminUsersPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('renders delete buttons for each user', () => {
    render(<AdminUsersPage />);
    const deleteButtons = screen.getAllByLabelText(/Delete/);
    expect(deleteButtons).toHaveLength(2);
  });
});
