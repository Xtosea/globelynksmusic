export async function getTrending(req, env) {

  const songs = await env.DB.prepare(`
    SELECT * FROM songs
    WHERE promotion_expires_at IS NULL
       OR promotion_expires_at > datetime('now')
    ORDER BY is_promoted DESC, downloads DESC
    LIMIT 20
  `).all();

  return new Response(JSON.stringify(songs.results));
}