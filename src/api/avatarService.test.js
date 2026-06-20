import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/system', () => ({
  compressImage: vi.fn(),
}));

import { prepareAvatarDataUrl } from './avatarService';
import { compressImage } from '../utils/system';

describe('prepareAvatarDataUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('compresses image and returns data URL', async () => {
    const dataUrl = 'data:image/jpeg;base64,abc';
    compressImage.mockResolvedValue(dataUrl);
    const file = new File(['img'], 'a.jpg', { type: 'image/jpeg' });

    const result = await prepareAvatarDataUrl(file);

    expect(compressImage).toHaveBeenCalledWith(file, 192, 192, 0.72);
    expect(result).toBe(dataUrl);
  });

  it('rejects non-image files', async () => {
    const file = new File(['txt'], 'a.txt', { type: 'text/plain' });
    await expect(prepareAvatarDataUrl(file)).rejects.toThrow('AVATAR_MUST_BE_IMAGE');
  });

  it('rejects oversized data URLs', async () => {
    compressImage.mockResolvedValue('x'.repeat(500_000));
    const file = new File(['img'], 'a.jpg', { type: 'image/jpeg' });
    await expect(prepareAvatarDataUrl(file)).rejects.toThrow('AVATAR_TOO_LARGE');
  });
});
