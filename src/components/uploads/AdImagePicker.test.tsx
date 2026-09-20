import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdImagePicker } from './AdImagePicker';
import * as uploadApi from '../../api/upload/upload.api';

describe('AdImagePicker', () => {
  let onUrlChange: (url: string) => void;

  beforeEach(() => {
    onUrlChange = vi.fn();
    vi.spyOn(uploadApi, 'uploadImage').mockResolvedValue('https://res.cloudinary.com/x/ad.jpg');
  });

  it('lets the admin paste an image URL directly', () => {
    render(<AdImagePicker value="" onUrlChange={onUrlChange} />);

    fireEvent.change(screen.getByPlaceholderText('https://…'), {
      target: { value: 'https://cdn.example.com/ad.png' },
    });

    expect(onUrlChange).toHaveBeenCalledWith('https://cdn.example.com/ad.png');
  });

  it('uploads a chosen file via the backend and fills the URL with the Cloudinary result', async () => {
    render(<AdImagePicker value="" onUrlChange={onUrlChange} />);
    const file = new File(['img'], 'ad.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Upload image'), { target: { files: [file] } });

    await waitFor(() => {
      expect(onUrlChange).toHaveBeenCalledWith('https://res.cloudinary.com/x/ad.jpg');
    });
    expect(uploadApi.uploadImage).toHaveBeenCalledWith(file);
  });
});