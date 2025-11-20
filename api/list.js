import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN
      // prefix: 'album/'   // istersen alt klasörle sınırla
    });

    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json(
      blobs.map((b) => ({
        url: b.url,
        size: b.size,
        uploadedAt: b.uploadedAt,
        contentType: b.contentType || ""
      }))
    );
  } catch (e) {
    console.error("list error:", e);
    res.status(500).json({ ok: false, message: String(e) });
  }
}
