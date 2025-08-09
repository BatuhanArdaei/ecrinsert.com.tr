import { createUploadUrl } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST required" });
  }
  try {
    const { url, pathname } = await createUploadUrl({
      addRandomSuffix: true,
      // ilk etapta minimal tutuyoruz; sorun çıkarsa burası temiz
      token: process.env.BLOB_READ_WRITE_TOKEN
      // allowedContentTypes: ['image/*','video/*'],
      // prefix: 'album/'     // istersek sonra açarız
    });
    res.status(200).json({ uploadUrl: url, pathname });
  } catch (e) {
    console.error("upload-url error:", e);
    res
      .status(500)
      .json({ ok: false, message: String(e), hasEnv: !!process.env.BLOB_READ_WRITE_TOKEN });
  }
}
