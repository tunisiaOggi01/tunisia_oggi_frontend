import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateAd } from '../../hooks/ads/mutations/useCreateAd';
import { AdsFormFields, type AdFormValues } from './sections/AdsFormFields';

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

/** Create-ad modal (screen-12): zod-validated form composed of shared fields, inline errors. */
export function CreateAdModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const create = useCreateAd();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdFormValues>({ resolver: zodResolver(schema) });

  if (!isOpen) return null;

  const isDateError = Boolean(errors.endDate);

  async function onSubmit(values: AdFormValues) {
    await create.mutateAsync({
      title: values.title,
      imageUrl: values.imageUrl,
      linkUrl: values.linkUrl,
      placement: values.placement,
      advertiserName: values.advertiserName || undefined,
      advertiserEmail: values.advertiserEmail || undefined,
      maxImpressions: values.maxImpressions ? Number(values.maxImpressions) : undefined,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    });
    reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{t('admin.ads.newAd')}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <AdsFormFields register={register} errors={errors} watch={watch} setValue={setValue} />

        {isDateError && <p className="mt-3 text-sm text-red-600">{t('admin.ads.formDateError')}</p>}
        {create.isError && !isDateError && (
          <p className="mt-3 text-sm text-red-600">{t('admin.ads.createFailed')}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 text-sm">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded bg-brand px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {create.isPending ? t('admin.ads.creating') : t('admin.ads.create')}
          </button>
        </div>
      </form>
    </div>
  );
}