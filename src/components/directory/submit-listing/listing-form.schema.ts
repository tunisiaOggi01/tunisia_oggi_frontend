import { z } from 'zod';
import type { BusinessCategory } from '../../../api/listings/types';

/** Category <option> metadata, kept beside the enum it mirrors. */
export const CATEGORY_OPTIONS: { value: BusinessCategory; label: string }[] = [
  { value: 'RESTAURANT', label: 'directory.categories.restaurant' },
  { value: 'LAW', label: 'directory.categories.law' },
  { value: 'REAL_ESTATE', label: 'directory.categories.realEstate' },
  { value: 'HEALTH', label: 'directory.categories.health' },
  { value: 'SERVICES', label: 'directory.categories.services' },
];

/** Mirrors the backend CreateListingDto: enum categories, 120/2000 length caps, E.164-ish phone. */
export const listingFormSchema = z.object({
  businessName: z
    .string({ message: 'submit.errors.businessNameRequired' })
    .max(120, 'submit.errors.businessNameTooLong'),
  category: z.enum(
    ['RESTAURANT', 'LAW', 'REAL_ESTATE', 'HEALTH', 'SERVICES'],
    { message: 'submit.errors.categoryRequired' },
  ),
  description: z
    .string()
    .max(2000, 'submit.errors.descriptionTooLong')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .refine((v) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/[\s-()]/g, '')), {
      message: 'submit.errors.phoneInvalid',
    }),
  email: z.email('submit.errors.emailInvalid'),
  website: z
    .url('submit.errors.websiteInvalid')
    .optional()
    .or(z.literal('')),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;