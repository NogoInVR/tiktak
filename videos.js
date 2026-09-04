export default async function handler(req, res) {
  const cookies = Object.fromEntries((req.headers.cookie||"").split(";").filter(Boolean).map(x=>x.trim().split("=")));
  if (!cookies.tt_session) return res.status(401).json({error:"Not connected to TikTok."});
  let session;
  try { session=JSON.parse(Buffer.from(cookies.tt_session,"base64url").toString()); }
  catch { return res.status(401).json({error:"Invalid session."}); }

  const r = await fetch("https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link", {
    method:"POST",
    headers:{"Authorization":`Bearer ${session.access_token}`,"Content-Type":"application/json"},
    body:JSON.stringify({max_count:20})
  });
  const data=await r.json();
  if(!r.ok || data.error?.code && data.error.code!=="ok") return res.status(r.status||400).json(data);
  res.setHeader("Cache-Control","no-store");
  const videos=(data.data?.videos||[]).map(v=>({...v,author:"TikTok",share_url:`https://www.tiktok.com/`}));
  res.json({videos});
}
