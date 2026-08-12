import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { SubmitListingForm } from './SubmitListingForm';

vi.mock('../../../hooks/listings/mutations/useSubmitListing', () => ({
  useSubmitListing: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

describe('SubmitListingForm', () => {
  it('renders all fields without crashing, including the phone country-code picker', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitListingForm onSuccess={vi.fn()} />
      </QueryClientProvider>,
    );
    expect(screen.getByLabelText('Country dialing code')).toHaveValue('+216');
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3);
  });
});