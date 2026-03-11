export const d1 = {
  // ================= USERS =================

  async getUserByEmail(email, env) {
    return await env.DB.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).bind(email).first();
  },

  async getUserById(id, env) {
    return await env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(id).first();
  },

  async createUser(email, password, env) {
    return await env.DB.prepare(
      "INSERT INTO users (email, password, premium, verified) VALUES (?, ?, 0, 0)"
    ).bind(email, password).run();
  },

  async upgradePremium(id, env) {
    return await env.DB.prepare(
      "UPDATE users SET premium = 1 WHERE id = ?"
    ).bind(id).run();
  },

  async verifyArtist(id, env) {
    return await env.DB.prepare(
      "UPDATE users SET verified = 1 WHERE id = ?"
    ).bind(id).run();
  },

  // ================= SONGS =================

  async getSongs(env) {
    return await env.DB.prepare(
      "SELECT * FROM songs ORDER BY id DESC"
    ).all()
      .then(res => res.results);
  },

  async getSongByFile(file, env) {
    return await env.DB.prepare(
      "SELECT * FROM songs WHERE file = ?"
    ).bind(file).first();
  },

  async saveSong({ file, image, title, artist }, env) {
    return await env.DB.prepare(
      "INSERT INTO songs (file, image, title, artist, downloads, promoted) VALUES (?, ?, ?, ?, 0, 0)"
    ).bind(file.name, image?.name || null, title, artist).run();
  },

  async incrementDownloads(file, env) {
    return await env.DB.prepare(
      "UPDATE songs SET downloads = downloads + 1 WHERE file = ?"
    ).bind(file).run();
  },

  async promoteSong(songId, env) {
    return await env.DB.prepare(
      "UPDATE songs SET promoted = 1 WHERE id = ?"
    ).bind(songId).run();
  }
};