import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/formatDate';
import type { NewsletterSubscriber } from '../../../api/newsletter/admin.api';

/** Subscribers table: email, confirmation state, subscription date, soft-delete action. */
export function SubscribersTable({
  subscribers,
  removingId,
  onRemove,
}: {
  subscribers: NewsletterSubscriber[];
  removingId?: string;
  onRemove: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();

  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
          <tr>
            <th className="px-4 py-3">{t('admin.newsletter.email')}</th>
            <th className="px-4 py-3">{t('admin.newsletter.status')}</th>
            <th className="hidden px-4 py-3 sm:table-cell">{t('admin.newsletter.date')}</th>
            <th className="px-4 py-3 text-right">{t('admin.newsletter.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3">{s.email}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold uppercase ${s.confirmedAt ? 'text-green-700' : 'text-amber-600'}`}>
                  {t(s.confirmedAt ? 'admin.newsletter.confirmed' : 'admin.newsletter.pending')}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{formatDate(s.subscribedAt, i18n.language)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  disabled={removingId === s.id}
                  onClick={() => onRemove(s.id)}
                  className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                >
                  {t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}