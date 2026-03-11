if(payment.type === "premium"){
  await env.DB.prepare(`
    UPDATE users SET premium = 1,
    premium_expiry = datetime('now', '+30 days')
    WHERE id = ?
  `).bind(userId).run();
}

if(payment.type === "badge"){
  await env.DB.prepare(`
    UPDATE artists SET verified = 1
    WHERE id = ?
  `).bind(artistId).run();
}