import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type AdFormValues = {
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: 'SIDEBAR' | 'IN_ARTICLE' | 'FOOTER' | 'HOME_STRIP';
  advertiserName?: string;
  advertiserEmail?: string;
  startDate: string;
  endDate: string;
};

const inputClass = 'w-full border border-gray-300 p-2 text-sm focus:border-brand focus:outline-none';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500';
const wrapClass = 'space-y-3';

/** All ad form inputs wired to react-hook-form — keeps the modal slim. */
export function AdsFormFields({
  register,
  errors,
}: {
  register: UseFormRegister<AdFormValues>;
  errors: FieldErrors<AdFormValues>;
}) {
  const { t } = useTranslation();
  void errors;

  return (
    <div className={wrapClass}>
      <div>
        <label className={labelClass}>{t('admin.ads.formTitle')}</label>
        <input {...register('title')} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{t('admin.ads.formImageUrl')}</label>
        <input {...register('imageUrl')} className={inputClass} placeholder="https://…" />
      </div>
      <div>
        <label className={labelClass}>{t('admin.ads.formLinkUrl')}</label>
        <input {...register('linkUrl')} className={inputClass} placeholder="https://…" />
      </div>
      <div>
        <label className={labelClass}>{t('admin.ads.formPlacement')}</label>
        <select {...register('placement')} className={inputClass}>
          <option value="SIDEBAR">SIDEBAR</option>
          <option value="IN_ARTICLE">IN_ARTICLE</option>
          <option value="FOOTER">FOOTER</option>
          <option value="HOME_STRIP">HOME_STRIP</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t('admin.ads.formAdvertiserName')}</label>
          <input {...register('advertiserName')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('admin.ads.formAdvertiserEmail')}</label>
          <input {...register('advertiserEmail')} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t('admin.ads.formStartDate')}</label>
          <input type="date" {...register('startDate')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('admin.ads.formEndDate')}</label>
          <input type="date" {...register('endDate')} className={inputClass} />
        </div>
      </div>
    </div>
  );
}