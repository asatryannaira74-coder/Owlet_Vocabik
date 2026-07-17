-- Աղյուսակ՝ օգտատերերի համար (ուսանողներ)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255),
  grade INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Աղյուսակ՝ ուսանողի առաջընթացի համար (ո՞ր դասերն են բացված/ավարտված)
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_count INTEGER DEFAULT 0,
  last_played_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, grade, lesson_id)
);

-- Աղյուսակ՝ սեսիաների համար (express-session-ի կողմից օգտագործվող)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT IF NOT EXISTS "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
