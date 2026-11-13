export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  uri TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  file_size_bytes INTEGER NOT NULL DEFAULT 0,
  triage_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  processed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(triage_status);

CREATE TABLE IF NOT EXISTS asset_metadata (
  asset_id TEXT PRIMARY KEY,
  captured_at TEXT,
  latitude REAL,
  longitude REAL,
  location_city TEXT,
  location_country TEXT,
  width INTEGER,
  height INTEGER,
  duration_seconds REAL,
  ai_description TEXT,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'custom'
);

CREATE TABLE IF NOT EXISTS asset_tags (
  asset_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  is_ai_suggested INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (asset_id, tag_id),
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_asset_tags_tag ON asset_tags(tag_id);

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_asset_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS album_assets (
  album_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  added_at TEXT NOT NULL,
  PRIMARY KEY (album_id, asset_id),
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_album_assets_album ON album_assets(album_id);
CREATE INDEX IF NOT EXISTS idx_album_assets_asset ON album_assets(asset_id);

CREATE TABLE IF NOT EXISTS triage_history (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);
`;

export const SEED_DEFAULT_TAGS_SQL = `
INSERT OR IGNORE INTO tags (id, name, type) VALUES
  ('tag-pers-mama', 'Mamá', 'person'),
  ('tag-pers-amigos', 'Amigos', 'person'),
  ('tag-pers-yo', 'Selfie / Yo', 'person'),
  ('tag-cat-comida', 'Comida', 'category'),
  ('tag-cat-paisaje', 'Paisaje / Naturaleza', 'category'),
  ('tag-cat-atardecer', 'Atardecer', 'category'),
  ('tag-cat-doc', 'Documento / Recibo', 'category'),
  ('tag-cat-mascota', 'Mascotas', 'category'),
  ('tag-evt-viaje', 'Viaje / Vacaciones', 'event'),
  ('tag-evt-fiesta', 'Fiesta / Reunión', 'event');
`;
