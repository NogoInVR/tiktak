export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = Object.fromEntries((req.headers.cookie||"").split(";").filter(Boolean).map(x=>x.trim().split("=")));
  if (!code || !state || state !== cookies.tt_state) return res.status(400).send("Invalid OAuth state.");
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.TIKTOK_REDIRECT_URI
  });
  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:params
  });
  const token = await tokenRes.json();
  if (!token.access_token) return res.status(400).json(token);

  // Store token in a real session/database for multi-user production apps.
  // For a single-user personal deployment, this cookie is enough for a prototype.
  const payload = Buffer.from(JSON.stringify({
    access_token: token.access_token,
    refresh_token: token.refresh_token || "",
    expires_at: Date.now() + (token.expires_in||86400)*1000
  })).toString("base64url");
  res.setHeader("Set-Cookie", [
    `tt_session=${payload}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
    `tt_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  ]);
  res.setHeader("Location","/");
  res.status(302).end();
}
