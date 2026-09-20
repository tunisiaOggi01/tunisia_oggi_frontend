import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { SubmitListingForm } from '../../components/directory/submit-listing/SubmitListingForm';

/** Screen-9: login-gated submission page; shows confirmation after a successful submit. */
export function SubmitListingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return <Navigate to="/admin/login?redirect=/directory/add" replace />;
  }

  if (user.role === 'VISITOR') {
    return <Navigate to="/directory" replace />;
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-brand">task_alt</span>
        <h1 className="mt-4 font-display text-headline-md text-gray-900">{t('submit.successTitle')}</h1>
        <p className="mt-3 text-body-md text-gray-500">{t('submit.successText')}</p>
        <Link to="/directory" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
          {t('submit.backToDirectory')}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <div className="mb-4 h-1 w-16 bg-brand" />
        <h1 className="font-display text-headline-lg text-gray-900">{t('submit.title')}</h1>
        <p className="mt-2 text-body-md text-gray-500">{t('submit.subtitle')}</p>
      </div>
      <SubmitListingForm onSuccess={() => setSubmitted(true)} />
    </main>
  );
}