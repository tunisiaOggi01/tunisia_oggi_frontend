import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useUpdateAd } from '../../hooks/ads/mutations/useUpdateAd';
import { AdsFormFields, type AdFormValues } from './sections/AdsFormFields';
import type { Advertisement } from '../../api/ads/types';

const schema = z
  .object({
    title: z.string().min(1).max(120),
    imageUrl: z.url(),
    linkUrl: z.url(),
    placement: z.enum(['SIDEBAR', 'IN_ARTICLE', 'FOOTER', 'HOME_STRIP']),
    advertiserName: z.string().max(120).optional().or(z.literal('')),
    advertiserEmail: z.email().optional().or(z.literal('')),
    maxImpressions: z
      .string()
      .optional()
      .refine((v) => !v || /^[1-9]\d*$/.test(v), { message: 'positive integer' }),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), {
    path: ['endDate'],
  });

/** Edit-ad modal — pre-fills form, disables startDate when ad is running (ATTIVA). */
export function EditAdModal({
  isOpen,
  onClose,
  ad,
}: {
  isOpen: boolean;
  onClose: () => void;
  ad: Advertisement | null;
}) {
  const { t } = useTranslation();
  const update = useUpdateAd();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdFormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (ad) {
      reset({
        title: ad.title,
        imageUrl: ad.imageUrl,
        linkUrl: ad.linkUrl,
        placement: ad.placement,
        advertiserName: ad.advertiserName ?? '',
        advertiserEmail: ad.advertiserEmail ?? '',
        startDate: ad.startDate.slice(0, 10),
        endDate: ad.endDate.slice(0, 10),
        maxImpressions: ad.maxImpressions?.toString() ?? '',
      });
    }
  }, [ad, reset]);

  if (!isOpen || !ad) return null;

  const isRunning = ad.status === 'ATTIVA';
  const isDateError = Boolean(errors.endDate);

  async function onSubmit(values: AdFormValues) {
    if (!ad) return;
    await update.mutateAsync({
      id: ad.id,
      payload: {
        title: values.title,
        imageUrl: values.imageUrl,
        linkUrl: values.linkUrl,
        placement: values.placement,
        advertiserName: values.advertiserName || undefined,
        advertiserEmail: values.advertiserEmail || undefined,
        maxImpressions: values.maxImpressions ? Number(values.maxImpressions) : undefined,
        startDate: isRunning ? undefined : new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{t('admin.ads.editAd')}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isRunning && (
          <p className="mb-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
            {t('admin.ads.runningAdHint')}
          </p>
        )}

        <AdsFormFields
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          disableStartDate={isRunning}
        />

        {isDateError && <p className="mt-3 text-sm text-red-600">{t('admin.ads.formDateError')}</p>}
        {update.isError && !isDateError && (
          <p className="mt-3 text-sm text-red-600">{t('admin.ads.updateFailed')}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 text-sm">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded bg-brand px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {update.isPending ? t('admin.ads.saving') : t('admin.ads.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
