import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSubmitListing } from '../../../hooks/listings/mutations/useSubmitListing';
import { FieldError } from './FieldError';
import { PhoneInput } from './phone-input/PhoneInput';
import { CATEGORY_OPTIONS, listingFormSchema, type ListingFormValues } from './listing-form.schema';

const inputClass = 'w-full border border-gray-300 p-3 text-sm focus:border-brand focus:outline-none';
const fieldLabel = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500';

/** Business-card form: mirrors the backend DTO validator, per-field errors, inline 409 detection. */
export function SubmitListingForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const mutation = useSubmitListing();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({ resolver: zodResolver(listingFormSchema) });
  const { field: phoneField } = useController({ name: 'phone' });

  const duplicate = axios.isAxiosError(mutation.error) && mutation.error.response?.status === 409;
  const firstError = Object.values(errors)[0];

  async function onSubmit(values: ListingFormValues) {
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
        <input {...register('businessName')} placeholder={t('submit.businessNamePlaceholder')} maxLength={120} className={inputClass} />
        {errors.businessName && <FieldError message={errors.businessName.message} />}
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.category')}</label>
        <select {...register('category')} className={inputClass}>
          <option value="">{t('submit.categoryPlaceholder')}</option>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{t(o.label)}</option>
          ))}
        </select>
        {errors.category && <FieldError message={errors.category.message} />}
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.description')}</label>
        <textarea {...register('description')} rows={4} maxLength={2000} placeholder={t('submit.descriptionPlaceholder')} className={`${inputClass} resize-none`} />
        {errors.description && <FieldError message={errors.description.message} />}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={fieldLabel}>{t('submit.phone')}</label>
          <PhoneInput value={phoneField.value} onChange={phoneField.onChange} />
          {errors.phone && <FieldError message={errors.phone.message} />}
        </div>
        <div>
          <label className={fieldLabel}>{t('submit.email')}</label>
          <input {...register('email')} placeholder={t('submit.emailPlaceholder')} className={inputClass} />
          {errors.email && <FieldError message={errors.email.message} />}
        </div>
      </div>
      <div>
        <label className={fieldLabel}>{t('submit.website')}</label>
        <input {...register('website')} placeholder={t('submit.websitePlaceholder')} className={inputClass} />
        {errors.website && <FieldError message={errors.website.message} />}
      </div>

      {duplicate && <p className="text-sm text-red-600">{t('submit.duplicateError')}</p>}
      {mutation.isError && !duplicate && <p className="text-sm text-red-600">{t('submit.failed')}</p>}
      {firstError && <p className="text-sm text-red-600">{t('submit.failed')}</p>}

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