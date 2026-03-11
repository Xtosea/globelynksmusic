export async function promoteSong(req, env) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload = await jwt.verify(token, env.JWT_SECRET);

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE id = ?`
  ).bind(payload.payload.userId).first();

  // 🚫 Block free users
  if (!user || !user.is_premium) {
    return new Response(JSON.stringify({
      error: "Upgrade to Premium to promote songs"
    }), { status: 403 });
  }

  const { songId } = await req.json();

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days boost

  await env.DB.prepare(`
    UPDATE songs
    SET is_promoted = 1,
        promotion_expires_at = ?
    WHERE id = ?
  `).bind(expiry.toISOString(), songId).run();

  return new Response(JSON.stringify({
    message: "Song promoted successfully 🚀"
  }));
}