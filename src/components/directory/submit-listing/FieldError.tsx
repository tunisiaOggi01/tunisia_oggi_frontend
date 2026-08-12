import { useTranslation } from 'react-i18next';

/** Inline form error line: translates an i18n key or falls back to the generic failure message. */
export function FieldError({ message }: { message?: string }) {
  const { t } = useTranslation();
  return <p className="mt-1 text-xs text-red-600">{t(message ?? 'submit.failed')}</p>;
}