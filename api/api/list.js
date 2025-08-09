// /api/list.js
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({
      prefix: 'album/',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    const out = blobs.map(b => ({
      url: b.url,                 // public URL (senin store domaininden döner)
      size: b.size,
      uploadedAt: b.uploadedAt,
      contentType: b.contentType || ''
    }));

    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message || 'list failed' });
  }
}
