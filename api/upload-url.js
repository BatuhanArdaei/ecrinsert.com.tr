// /api/upload-url.js
import { createUploadUrl } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  try {
    const { url, pathname } = await createUploadUrl({
      // hepsini album/ altinda toplayalim
      prefix: 'album/',
      addRandomSuffix: true,
      // sadece resim/video kabul et (istersen kaldir)
      allowedContentTypes: ['image/*', 'video/*'],
      // Yeni arayuzde token Store ID de olabilir; env'e eklediysen otomatik kullanilir
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ uploadUrl: url, pathname });
  } catch (e) {
    res.status(500).json({ error: e.message || 'createUploadUrl failed' });
  }
}
