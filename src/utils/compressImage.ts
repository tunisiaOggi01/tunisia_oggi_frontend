/**
 * Vercel rejects request bodies above ~1 MB (503 SERVICE_UNAVAILABLE) before they reach the API,
 * so images are downscaled and re-encoded in the browser before upload.
 */
const MAX_BYTES = 900 * 1024;
const PASSES = [
  { maxSide: 1920, quality: 0.85 },
  { maxSide: 1600, quality: 0.72 },
  { maxSide: 1280, quality: 0.6 },
];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unreadable image')); };
    img.src = url;
  });
}

function encode(img: HTMLImageElement, maxSide: number, type: string, quality: number): Promise<Blob | null> {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Returns a file small enough to upload; small files and GIFs (possibly animated) pass through untouched. */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_BYTES || file.type === 'image/gif' || !file.type.startsWith('image/')) return file;

  const img = await loadImage(file);
  let best: Blob | null = null;
  for (const { maxSide, quality } of PASSES) {
    let blob = await encode(img, maxSide, 'image/webp', quality);
    // Browsers without a WebP encoder silently return PNG; fall back to JPEG.
    if (!blob || blob.type !== 'image/webp') blob = await encode(img, maxSide, 'image/jpeg', quality);
    if (blob && (!best || blob.size < best.size)) best = blob;
    if (best && best.size <= MAX_BYTES) break;
  }
  if (!best) return file;

  const ext = best.type === 'image/webp' ? 'webp' : 'jpg';
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return new File([best], name, { type: best.type });
}
