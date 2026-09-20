import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadImage } from '../../api/upload/upload.api';

type UploadStatus = 'idle' | 'uploading' | 'error';

const inputClass = 'w-full border border-gray-300 p-2 text-sm focus:border-brand focus:outline-none';

/** Ad-image picker: uploads a file to Cloudinary via the backend, or lets the admin paste an image URL. */
export function AdImagePicker({
  value,
  onUrlChange,
}: {
  value: string;
  onUrlChange: (url: string) => void;
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setStatus('uploading');
    uploadImage(file)
      .then((url) => {
        onUrlChange(url);
        setStatus('idle');
      })
      .catch(() => setStatus('error'));
  }

  return (
    <div className="space-y-2">
      {value && <img src={value} alt="" className="h-28 w-full border border-gray-300 object-cover" />}
      <input
        ref={fileRef}
        id="ad-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <label
        htmlFor="ad-image-upload"
        className="inline-block cursor-pointer border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-brand"
      >
        {status === 'uploading' ? t('admin.ads.formImageUploading') : t('admin.ads.formImageUpload')}
      </label>
      {status === 'error' && <p className="text-xs text-red-600">{t('admin.ads.formImageUploadFailed')}</p>}
      <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {t('admin.ads.formImageOr')}
      </p>
      <input
        value={value}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://…"
        className={inputClass}
      />
    </div>
  );
}