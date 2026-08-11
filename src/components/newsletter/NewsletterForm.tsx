import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscribeNewsletter } from '../../hooks/newsletter/useSubscribeNewsletter';

type Variant = 'light' | 'brand' | 'dark';

const UI: Record<Variant, { input: string; button: string; message: string }> = {
  light: {
    input: 'w-full border border-gray-300 bg-white p-3 text-sm focus:border-brand focus:outline-none',
    button: 'w-full bg-brand px-4 py-3 text-xs font-semibold tracking-wider text-white hover:opacity-90',
    message: 'text-xs text-gray-600',
  },
  brand: {
    input: 'w-full px-4 py-3 text-gray-900 focus:ring-2 focus:ring-white/40',
    button: 'w-full bg-gray-900 py-3 text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-black',
    message: 'text-[11px] text-white/80',
  },
  dark: {
    input: 'w-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none',
    button: 'w-full bg-white py-2.5 text-sm font-semibold text-brand hover:opacity-90',
    message: 'text-xs text-white/80',
  },
};

/** Functional newsletter signup form: email input, loading/success/duplicate/error states, skinnable. */
export function NewsletterForm({ variant }: { variant: Variant }) {
  const { t } = useTranslation();
  const subscribe = useSubscribeNewsletter();
  const [email, setEmail] = useState('');

  const duplicate =
    axios.isAxiosError(subscribe.error) && subscribe.error.response?.status === 409;

  if (subscribe.isSuccess) {
    return <p className={UI[variant].message}>{t('components.newsletter.success')}</p>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    void subscribe.mutate(email);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('components.newsletter.emailPlaceholder')}
        className={UI[variant].input}
      />
      <button type="submit" disabled={subscribe.isPending} className={UI[variant].button}>
        {subscribe.isPending ? t('components.newsletter.subscribing') : t('components.newsletter.subscribe')}
      </button>
      {duplicate && <p className={UI[variant].message}>{t('components.newsletter.duplicate')}</p>}
      {subscribe.isError && !duplicate && (
        <p className={UI[variant].message}>{t('components.newsletter.failed')}</p>
      )}
    </form>
  );
}