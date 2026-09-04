export default function handler(req, res) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  if (!clientKey || !redirectUri) return res.status(500).json({error:"Missing TikTok environment variables."});

  const state = crypto.randomUUID();
  // Demo-friendly state cookie. For production, use a signed/encrypted session store.
  res.setHeader("Set-Cookie", `tt_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "user.info.basic,video.list");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  res.redirect(302, url.toString());
}
