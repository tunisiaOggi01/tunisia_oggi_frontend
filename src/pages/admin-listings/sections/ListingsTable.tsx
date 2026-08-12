import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/formatDate';
import type { BusinessListing, ListingStatus } from '../../../api/listings/types';

/** Review table: business, category, contact, submitted date, status and approve/reject/delete actions. */
export function ListingsTable({
  listings,
  busyId,
  onStatus,
  onDelete,
}: {
  listings: BusinessListing[];
  busyId?: string;
  onStatus: (id: string, status: ListingStatus) => void;
  onDelete: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();

  const statusClass: Record<ListingStatus, string> = {
    PENDING: 'text-amber-600',
    APPROVED: 'text-green-700',
    REJECTED: 'text-red-700',
  };

  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
          <tr>
            <th className="px-4 py-3">{t('admin.listings.colBusiness')}</th>
            <th className="px-4 py-3">{t('admin.listings.colCategory')}</th>
            <th className="hidden px-4 py-3 md:table-cell">{t('admin.listings.colContact')}</th>
            <th className="hidden px-4 py-3 sm:table-cell">{t('admin.listings.colDate')}</th>
            <th className="px-4 py-3">{t('admin.listings.colStatus')}</th>
            <th className="px-4 py-3 text-right">{t('admin.listings.colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 font-semibold text-gray-800">{l.businessName}</td>
              <td className="px-4 py-3 text-gray-600">{t(`directory.categories.${l.category.toLowerCase()}`)}</td>
              <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                <p>{l.phone}</p>
                <p>{l.email}</p>
              </td>
              <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{formatDate(l.submittedAt, i18n.language)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold uppercase ${statusClass[l.status]}`}>
                  {t(`admin.listings.status.${l.status.toLowerCase()}`)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  {l.status !== 'APPROVED' && (
                    <button
                      type="button"
                      disabled={busyId === l.id}
                      onClick={() => onStatus(l.id, 'APPROVED')}
                      className="text-xs font-semibold text-green-700 hover:underline disabled:opacity-50"
                    >
                      {t('admin.listings.approve')}
                    </button>
                  )}
                  {l.status !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={busyId === l.id}
                      onClick={() => onStatus(l.id, 'REJECTED')}
                      className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                    >
                      {t('admin.listings.reject')}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === l.id}
                    onClick={() => onDelete(l.id)}
                    className="text-xs font-semibold text-gray-400 hover:underline disabled:opacity-50"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}