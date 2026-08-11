import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useSubmitListing } from '../../../hooks/listings/mutations/useSubmitListing';
import type { BusinessCategory } from '../../../api/listings/types';

const schema = z.object({
  businessName: z.string().min(1).max(120),
  category: z.enum(['RESTAURANT', 'LAW', 'REAL_ESTATE', 'HEALTH', 'SERVICES']),
  description: z.string().max(2000).optional().or(z.literal('')),
  phone: z.string().min(8),
  email: z.email(),
  website: z.url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;
const CATEGORY_OPTIONS: { value: BusinessCategory; label: string }[] = [
  { value: 'RESTAURANT', label: 'directory.categories.restaurant' },
  { value: 'LAW', label: 'directory.categories.law' },
  { value: 'REAL_ESTATE', label: 'directory.categories.realEstate' },
  { value: 'HEALTH', label: 'directory.categories.health' },
  { value: 'SERVICES', label: 'directory.categories.services' },
];

const inputClass = 'w-full border border-gray-300 p-3 text-sm focus:border-brand focus:outline-none';
const fieldLabel = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500';

/** Business-card form: zod-validated fields, duplicate (409) detection, inline error reporting. */
export function SubmitListingForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const mutation = useSubmitListing();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const duplicate = axios.isAxiosError(mutation.error) && mutation.error.response?.status === 409;

  async function onSubmit(values: FormValues) {
    await mutation.mutateAsync({
      businessName: values.businessName,
      category: values.category,
      description: values.description || undefined,
      phone: values.phone,
      email: values.email,
      website: values.website || undefined,
    });
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border border-gray-200 bg-white p-6">
      <div>
        <label className={fieldLabel}>{t('submit.businessName')}</label>
        <input {...register('businessName')} placeholder={t('submit.businessNamePlaceholder')} className={inputClass} />
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.category')}</label>
        <select {...register('category')} className={inputClass}>
          <option value="">{t('submit.categoryPlaceholder')}</option>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{t(o.label)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.description')}</label>
        <textarea {...register('description')} rows={4} placeholder={t('submit.descriptionPlaceholder')} className={`${inputClass} resize-none`} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={fieldLabel}>{t('submit.phone')}</label>
          <input {...register('phone')} placeholder={t('submit.phonePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label className={fieldLabel}>{t('submit.email')}</label>
          <input {...register('email')} placeholder={t('submit.emailPlaceholder')} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.website')}</label>
        <input {...register('website')} placeholder={t('submit.websitePlaceholder')} className={inputClass} />
      </div>

      {duplicate && <p className="text-sm text-red-600">{t('submit.duplicateError')}</p>}
      {mutation.isError && !duplicate && <p className="text-sm text-red-600">{t('submit.failed')}</p>}
      {Object.keys(errors).length > 0 && <p className="text-sm text-red-600">{t('submit.failed')}</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-brand py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {mutation.isPending ? t('submit.submitting') : t('submit.submit')}
      </button>
    </form>
  );
}