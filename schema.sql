-- ================= USERS TABLE =================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  premium BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================= SONGS TABLE =================
CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  file TEXT NOT NULL,           -- filename in R2
  image TEXT,                   -- optional cover image filename
  downloads INTEGER DEFAULT 0,
  promoted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================= TRANSACTIONS TABLE =================
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,           -- "premium" or "verify"
  amount REAL DEFAULT 0,
  status TEXT DEFAULT 'pending', -- "pending", "success", "failed"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ================= PROMOTIONS TABLE =================
CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  promoted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(song_id) REFERENCES songs(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ================= OPTIONAL: PREMIUM LOG =================
CREATE TABLE IF NOT EXISTS premium_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id)
);