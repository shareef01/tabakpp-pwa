import { compressImage } from '../utils/system';

/** Stay under Firestore's ~1 MiB doc limit (avatar + other fields). */
const MAX_DATA_URL_CHARS = 400_000;

/**
 * Compress avatar to a JPEG data URL stored in Firestore (profile.avatar).
 * No Firebase Storage required (Spark / free plan friendly).
 */
export const prepareAvatarDataUrl = async (file) => {
  if (!file) throw new Error('INVALID_AVATAR');
  if (!file.type?.startsWith('image/')) throw new Error('AVATAR_MUST_BE_IMAGE');

  const dataUrl = await compressImage(file, 192, 192, 0.72);
  if (typeof dataUrl !== 'string' || dataUrl.length > MAX_DATA_URL_CHARS) {
    throw new Error('AVATAR_TOO_LARGE');
  }
  return dataUrl;
};
